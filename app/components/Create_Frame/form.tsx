"use client";

import clsx from "clsx";
import { customAlphabet } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useUploadThing } from "../../utils/uploadthing";
import slugify from "slugify";

const HOST = process.env.NEXT_PUBLIC_HOST;

export function GalleryCreateForm() {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 7);
  const [initialUploadSortingType, setInitialUploadSortingType] = useState<File[]>([]);
  const [displayedFileList, setDisplayedFileList] = useState<File[]>([]);

  const [error, setError] = useState("");
  const [imageId, setImageId] = useState("");
  const imagesRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [warpcastUrl, setWarpcastUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState("");
  const [sortingType, setSortingType] = useState("");
  const [sortingMethod, setSortingMethod] = useState("asc");
  const readmoreRef = useRef<HTMLInputElement | null>(null);
  const [readmoreLabel, setReadmoreLabel] = useState("");
  const [readmoreLink, setReadmoreLink] = useState("");
  const [hasReadmore, setHasReadmore] = useState(false);
  const [frameRatio, setFrameRatio] = useState<"1.91:1" | "1:1">("1.91:1");

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {},
    onUploadError: () => {
      throw new Error("something went wrong while uploading");
    },
    onUploadBegin: () => {},
  });

  function showImages(e: any) {
    setError("");
    let files = e.target.files as File[];
    if (files.length !== 1) {
      setError("Only one image is allowed");
      setInitialUploadSortingType([]);
      e.target.value = "";
      return;
    }
    const curr = files[0];
    const currType = curr.type.replace(/(.*)\//g, "");
    if (!["png", "jpeg", "jpg", "webp", "gif"].includes(currType)) {
      setError("Only jpeg, png, jpg, webp, and gif files are allowed");
      setInitialUploadSortingType([]);
      e.target.value = "";
      return;
    }
    setInitialUploadSortingType([curr]);
  }

  async function handleSubmit(event: any) {
    setError("");

    event.preventDefault();
    if (displayedFileList.length === 0) {
      setError("No File Chosen");
      return;
    }

    if (displayedFileList.length !== 1) {
      setError("Only one image is allowed");
      return;
    }

    if (hasReadmore && !readmoreLink) {
      setError('Enter an external link or uncheck the "Add read more" checkbox');
      return;
    }

    let usedReadMoreLabel = readmoreLabel;
    if (hasReadmore && !usedReadMoreLabel) usedReadMoreLabel = "Read More";

    setIsLoading(true);
    setLoadingMessage("Uploading Images...");

    let filesUploaded;

    try {
      const fileUploadResponse = await startUpload(displayedFileList).catch((err) => {
        console.log({ err });
      });
      filesUploaded = fileUploadResponse;
    } catch (error) {
      console.log({ error });
      setError("Something went wrong uploading the files");
    }

    if (filesUploaded) {
      setLoadingMessage("Creating Gallery...");
      const filesToSendToKVStore = filesUploaded.map((file, index) => {
        return { url: file.url, created_at: Date.now() + index };
      });
      const sluggifiedId = slugify(imageId, {
        replacement: "-",
        trim: true,
      });

      const galleryId = sluggifiedId || nanoid();
      let payload;
      if (hasReadmore) {
        payload = {
          galleryId,
          filesToSendToKVStore,
          password,
          frameRatio,
          readmore: {
            label: usedReadMoreLabel,
            link: readmoreLink,
          },
        };
      } else {
        payload = {
          galleryId,
          filesToSendToKVStore,
          password,
          frameRatio,
        };
      }
      try {
        const res = await fetch("api/upload-gallery", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!result.success) {
          throw new Error(result.error);
        }
        event.target.reset();
        setInitialUploadSortingType([]);
        setError("");
        setWarpcastUrl(`${HOST}/gallery/${galleryId}`);
        setImageId("");
        setPassword("");
      } catch (error) {
        console.log({ error });
        //@ts-expect-error message not in error
        setError(error?.message);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setDisplayedFileList(initialUploadSortingType);
    if (initialUploadSortingType.length == 0) {
      imagesRef.current!.value = "";
    }
    setSortingMethod("default");
    setSortingType("asc");
  }, [initialUploadSortingType]);

  useEffect(() => {
    let finalDisplayedData: File[] = [];
    switch (sortingType) {
      case "default":
        finalDisplayedData = [...initialUploadSortingType];
        break;
      case "date":
        finalDisplayedData = [...initialUploadSortingType].sort(
          (a, b) => a.lastModified - b.lastModified
        );
        break;
      case "name":
        finalDisplayedData = [...initialUploadSortingType].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case "size":
        finalDisplayedData = [...initialUploadSortingType].sort(
          (a, b) => a.size - b.size
        );
        break;
    }
    if (sortingMethod === "desc") {
      finalDisplayedData = [...finalDisplayedData].reverse();
    }
    setDisplayedFileList(finalDisplayedData);
  }, [sortingType]);
  useEffect(() => {
    setDisplayedFileList([...displayedFileList].reverse());
  }, [sortingMethod]);

  function formatFileSize(_size: number) {
    var fSExt = new Array("Bytes", "KB", "MB", "GB"),
      i = 0;
    while (_size > 900) {
      _size /= 1024;
      i++;
    }
    var exactSize = Math.round(_size * 100) / 100 + " " + fSExt[i];
    return exactSize;
  }

  console.log({ frameRatio });

  return (
    <>
      {error && (
        <p className="bg-red-300 px-4 py-2 rounded-lg w-[70%] mx-auto text">
          {error}
        </p>
      )}
      <div className="mx-8 w-full">
        <form className="relative my-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              name="image_id"
              id="image_id"
              placeholder="Id of existing or new gallery (optional)"
              className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-400 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
              value={imageId}
              onChange={(e) => {
                setImageId(e.target.value);
              }}
            />
            <details className="text-start pl-3 pr-28 mt-1">
              <summary className="text-gray-600">When to put an id?</summary>
              <ul>
                <li>
                  1. If you want to have something personalized like
                </li>
                <li>
                  2. It can be risky if you use common words (someone may have
                  already picked it)
                </li>
                <li>
                  3. You can add more images to your gallery by supplying the
                  same id used in creation. <br />
                  <strong>NOTE:</strong> If you want others to add their
                  images to the gallery, put a password on initial creation.
                </li>
              </ul>
            </details>
          </div>
          <div>
            <input
              name="password"
              id="password"
              placeholder="Enter a password (optional)"
              className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-400 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="p-3 relative bg-slate-50 border border-dashed border-gray-400 rounded-md w-full h-96 flex items-center justify-center">
            <div className="absolute top-0 left-0 right-0 text-center mt-4">
              <label
                htmlFor="images"
                className="relative cursor-pointer font-medium text-indigo-600 bg-slate-50"
              >
                <span>Upload Image</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  ref={imagesRef}
                  accept="image/*"
                  className="sr-only"
                  onChange={showImages}
                  disabled={displayedFileList.length >= 1}
                />
              </label>
              {displayedFileList.length < 1 && (
                <p className="text-xs text-gray-500">Only one image allowed</p>
              )}
            </div>
            <div
              className={clsx(
                "h-full w-full grid place-items-center",
                displayedFileList.length > 0 && "overflow-y-auto"
              )}
            >
              {displayedFileList.length === 0 && (
                <p className="font-medium text-lg">No files uploaded yet</p>
              )}
              {displayedFileList.length > 0 && (
                <div className="px-4 sm:px-6 lg:px-8 w-full">
                  <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                      <h1 className="text-lg font-semibold text-gray-900">
                        Files Uploaded
                      </h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                      <label htmlFor="sorting" className="block text-sm font-medium text-gray-700">
                        Sort by:
                      </label>
                      <select
                        id="sorting"
                        name="sorting"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={sortingType}
                        onChange={(e) => {
                          setSortingType(e.target.value);
                        }}
                      >
                        <option value="default">Default</option>
                        <option value="date">Date</option>
                        <option value="name">Name</option>
                        <option value="size">Size</option>
                      </select>
                      <label htmlFor="sortingMethod" className="block text-sm font-medium text-gray-700 mt-2">
                        Order:
                      </label>
                      <select
                        id="sortingMethod"
                        name="sortingMethod"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={sortingMethod}
                        onChange={(e) => {
                          setSortingMethod(e.target.value);
                        }}
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Size
                                </th>
                                <th
                                  scope="col"
                                  className="relative px-6 py-3"
                                >
                                  <span className="sr-only">Delete</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {displayedFileList.map((file) => (
                                <tr key={file.name}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {file.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatFileSize(file.size)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      type="button"
                                      className="text-indigo-600 hover:text-indigo-900"
                                      onClick={() => {
                                        setDisplayedFileList(
                                          displayedFileList.filter(
                                            (f) => f !== file
                                          )
                                        );
                                        setInitialUploadSortingType(
                                          initialUploadSortingType.filter(
                                            (f) => f !== file
                                          )
                                        );
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="hasReadmore"
              className="inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="hasReadmore"
                className="form-checkbox text-indigo-600"
                checked={hasReadmore}
                onChange={(e) => setHasReadmore(e.target.checked)}
              />
              <span className="ml-2">Add read more</span>
            </label>
            {hasReadmore && (
              <>
                <div className="mt-2">
                  <input
                    ref={readmoreRef}
                    name="readmoreLabel"
                    id="readmoreLabel"
                    placeholder="Read more label (optional)"
                    className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-400 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    value={readmoreLabel}
                    onChange={(e) => {
                      setReadmoreLabel(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <input
                    ref={readmoreRef}
                    name="readmoreLink"
                    id="readmoreLink"
                    placeholder="Read more link"
                    className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-400 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    value={readmoreLink}
                    onChange={(e) => {
                      setReadmoreLink(e.target.value);
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Create Gallery"
              )}
            </button>
          </div>
        </form>
        {warpcastUrl && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">
              Gallery created! Here's the link:
            </h2>
            <div className="mt-2 flex items-center">
              <a
                href={warpcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-900"
              >
                {warpcastUrl}
              </a>
              <button
                className="ml-2 text-sm text-indigo-600 hover:text-indigo-900"
                onClick={() => {
                  navigator.clipboard.writeText(warpcastUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
