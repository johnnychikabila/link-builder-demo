import Image from "next/image";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ImageUploading, { ImageListType } from "react-images-uploading";
import supabase from "@/utils/supabaseClient";

type Link = {
  title: string;
  url: string;
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();
  const [links, setLinks] = useState<Link[]>();
  const [images, setImages] = useState<ImageListType>([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState<
    string | undefined
  >();
  const router = useRouter();
  const { creatorSlug } = router.query;

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log("user: ", user);
      if (user) {
        const userId = user.data.user?.id;
        setIsAuthenticated(true);
        setUserId(userId);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error } = await supabase
          .from("links")
          .select("title, url")
          .eq("user_id", userId);

        if (error) throw error;

        setLinks(data);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    if (userId) {
      getLinks();
    }
  }, [userId]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, profile_picture_url")
          .eq("username", creatorSlug);
        if (error) throw error;
        const profilePictureUrl = data[0]["profile_picture_url"];
        const userId = data[0]["id"];
        setProfilePictureUrl(profilePictureUrl);
        setUserId(userId);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    if (creatorSlug) {
      getUser();
    }
  }, [creatorSlug]);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //   } else console.log("Authentication status: ", isAuthenticated);
  // }, [isAuthenticated, router]);

  const addNewLink = async () => {
    try {
      if (title && url && userId) {
        const { data, error } = await supabase
          .from("links")
          .insert({
            title: title,
            url: url,
            user_id: userId,
          })
          .select();
        if (error) throw error;
        console.log("data: ", data);
        if (links) {
          setLinks([...data, ...links]);
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const uploadProfilePicture = async () => {
    try {
      if (images.length > 0) {
        const image = images[0];
        if (image.file && userId) {
          const { data, error } = await supabase.storage
            .from("Public")
            .upload(`${userId}/${image.file.name}`, image.file, {
              upsert: true,
            });
          if (error) throw error;
          const resp = supabase.storage.from("Public").getPublicUrl(data.path);
          const publicUrl = resp.data.publicUrl;
          const updateUserResponse = await supabase
            .from("users")
            .update({ profile_picture_url: publicUrl })
            .eq("id", userId);
          if (updateUserResponse.error) throw error;
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  function goToLogin() {
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center p-24">
      <div className="flex flex-row justify-end flex-wrap z-10 max-w-8xl w-full font-mono text-sm">
        <div className="fixed left-0 top-0 flex flex-row w-full justify-center items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 py-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit ">
          For started editing go to
          <button
            type="button"
            className="mx-4 rounded-xl bg-blue-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200"
            onClick={goToLogin}
          >
            Login
          </button>
        </div>
        <div className="flex flex-col flex-shrink w-[55vw] h-full justify-center items-center mt-2">
          {profilePictureUrl && (
            <Image
              src={profilePictureUrl}
              height={100}
              width={100}
              alt="profile-picture"
              className="rounded-full max-w-[100px] max-h-[100px] object-cover"
            />
          )}
          {links?.map((link: Link, index: number) => (
            <div
              className="text-center shadow-xl w-60 mt-4 rounded-xl border-solid border-2 border-gray-500 px-4 py-2 text-base font-medium text-gray-500 transition duration-200 hover:bg-gray-600 hover:text-white active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-20"
              key={index}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = link.url;
              }}
            >
              {link.title}
            </div>
          ))}
        </div>
        {isAuthenticated && (
          <div className=" flex-shrink-0 w-[276px] mt-4 mb-20 rounded-xl border-dotted border-2 border-gray-400 px-6 py-4 text-xs font-medium text-gray-400">
            add new link
            <div className="flex flex-col w-full justify-center items-center mt-2">
              <div className="mt-2">
                <input
                  name="Title "
                  placeholder="your title"
                  id="title"
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-600 focus:ring-gray-600 sm:text-xs"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mt-2">
                <input
                  name="Url "
                  placeholder="your url"
                  id="url"
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-600 focus:ring-gray-600 sm:text-xs"
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="mt-4 rounded-md border-solid border-[1.5px] border-gray-500 px-4 py-2 text-xs text-gray-500 transition duration-200 hover:bg-gray-600 hover:text-white active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200"
                onClick={addNewLink}
              >
                add
              </button>
              <div className="w-[220px] mt-8 rounded-xl text-xs font-medium text-gray-400">
                upload profile pic
                <div className="flex flex-col items-center w-fit mt-1 rounded-xl px-4 py-2 text-xs font-medium text-gray-500 transition duration-200">
                  {images.length > 0 && (
                    <Image
                      className="object-center"
                      src={images[0]["data_url"]}
                      height={50}
                      width={50}
                      alt="upload-picture"
                    />
                  )}
                  <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={1}
                    dataURLKey="data_url"
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => (
                      // write your building UI
                      <div className="upload__image-wrapper text-center py-2">
                        <button
                          className="mt-1 py-2 w-full rounded-md border-[1.5px] border-gray-200 transition delay-30 hover:shadow-xl hover:bg-gray-200 hover:border-solid hover:border-gray-400"
                          style={isDragging ? { color: "red" } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          Click or Drop here
                        </button>
                        &nbsp;
                        <button
                          className="mt-1 py-2 w-full rounded-md text-red-400 transition delay-30 hover:shadow-xl hover:bg-red-400 hover:text-white"
                          onClick={onImageRemoveAll}
                        >
                          Remove all images
                        </button>
                        {imageList.map((image, index) => (
                          <div key={index} className="image-item">
                            {/* <img src={image["data_url"]} alt="" width="100" /> */}
                            <div className="image-item__btn-wrapper">
                              <button onClick={() => onImageUpdate(index)}>
                                Update
                              </button>
                              <button onClick={() => onImageRemove(index)}>
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ImageUploading>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-md border-solid border-[1.5px] border-gray-400 px-4 py-2 text-xs font-medium text-gray-500 transition duration-200 hover:bg-green-200 hover:border-gray-500 hover:text-gray-700 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200"
                    onClick={uploadProfilePicture}
                  >
                    upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="fixed bottom-0 lg:bottom-8 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black ">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              src="/next.svg"
              alt="Next.js Logo"
              width={180}
              height={37}
              priority
            />
          </a>
        </div>
      </div>
    </main>
  );
}
