/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { ImageGrid } from "./imageGrid";
import { createApi } from "unsplash-js";
import CryptoJS from "crypto-js";
import axios from "axios";
import { toast } from "react-toastify";
import { navigate } from "@reach/router";
import DrawingCanvas from "./DrawingCanvas";
import { imageText } from "./utils/helpers";
import classnames from "classnames";

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
  fetch: fetch,
});

const TILES_COUNT = Number(process.env.REACT_APP_TOTAL_TILES_COUNT);
const ROUNDS_COUNT = Number(process.env.REACT_APP_TOTAL_ITERATION_COUNT);

function hashingSHA(image, ref_point) {
  const str = image + ref_point.join();
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.base64);
}

function encryptImage(image, key) {
  return CryptoJS.AES.encrypt(image, key).toString();
}

function RegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [rawImages, setRawImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [sequences, setSequencess] = useState([]);
  const [roundNumber, setRoundNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const getImages = async () => {
    if (category.trim() === "") {
      toast.error("Please fill out all the fields.");
      return;
    }
    setIsLoading(true);
    let fullImages = [];
    let thumbnails = [];

    try {
      const tempResult = await unsplash.search.getPhotos({
        query: category,
        page: 1,
        perPage: 1,
        orientation: "squarish",
      });

      const pic = tempResult.response;
      const totalImages = pic.total;
      const randomNumber = Math.floor(Math.random() * totalImages) + 1;
      const imagePage = Math.floor(randomNumber / 30) + 1;

      const result = await unsplash.search.getPhotos({
        query: category,
        page: imagePage,
        perPage: 9,
        orientation: "squarish",
      });

      const pictures = result.response;
      pictures.results.forEach((pic) => {
        fullImages.push(`${pic.urls.full}&crop=faces&fit=crop&h=250&w=250`);
        thumbnails.push(`${pic.urls.thumb}&crop=faces&fit=crop&h=250&w=250`);
      });

      setIsLoading(false);
      setRawImages(fullImages);
      setThumbnails(thumbnails);
    } catch (err) {
      toast.error(err?.response?.data?.msg);
    }
  };

  const addImageAndTileSequences = (image, tileSequences) => {
    setSequencess((prev) => [
      ...prev,
      {
        image,
        tileSequences: tileSequences,
      },
    ]);
    setRoundNumber((prev) => prev + 1);
    setCategory("");
    setRawImages([]);
    setThumbnails([]);
  };

  const register = async () => {
    if (!name || !name.trim() || !email || !email.trim()) {
      toast.warning("Please enter your details");
    }
    const hashes = [];
    let passwordHints = [];

    sequences.map((imageSelection) => {
      passwordHints.push(imageText(imageSelection.image));
      hashes.push(
        hashingSHA(imageSelection.image, imageSelection.tileSequences)
      );
    });

    Promise.all(passwordHints).then(async (values) => {
      let passwordHintList = [];
      for (let i = 0; i < values.length; i++) {
        passwordHintList.push(values[i].text);
      }

      const encryptedImages = [];

      for (let i = 0; i < ROUNDS_COUNT; i++) {
        encryptedImages.push(encryptImage(sequences[i].image, hashes[i]));
      }

      const passwordHash = CryptoJS.SHA256(hashes.join()).toString(
        CryptoJS.enc.base64
      );
      try {
        const res = await axios.post("http://localhost:4000/api/register", {
          name,
          email,
          passwordHash,
          images: [sequences[0].image, ...encryptedImages],
          passwordHints: passwordHintList,
        });
        if (res.status === 200) {
          toast.success(res?.data?.msg);
          navigate("/login");
        }
      } catch (error) {
        if (error.reponse.status === 500) {
          toast.error(error?.response?.data?.msg);
        } else {
          toast.error(error?.response?.data?.msg);
          sequences.current = [];
          setRoundNumber(0);
        }
      }
    });
  };

  return (
    <>
      <DrawingCanvas
        modalIsOpen={showCaptcha}
        setIsOpen={setShowCaptcha}
        onResult={(captchaResult) => {
          if (captchaResult) {
            setIsHuman(true);
            getImages();
          } else {
            toast.warning("Are you human? Please try again");
          }
          setShowCaptcha(false);
        }}
      />

      <div className="bg-blue-900">
        <div
          className={classnames("w-full flex items-center justify-center", {
            "h-screen": isLoading,
          })}
        >
          <form
            className="w-full md:w-1/3 bg-white rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
              if (roundNumber === 0 && !isHuman) {
                setIsHuman(true);
                getImages();
              } else {
                getImages();
              }
            }}
          >
            <div className="flex font-bold justify-center mt-6">
              <img
                className="h-20 w-20"
                src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/avatar.svg"
              ></img>
            </div>
            <h2 className="text-3xl text-center text-gray-700 mb-4">Sign Up</h2>
            {
              <div className="px-12 pb-10">
                <div className="w-full mb-2">
                  <div className="flex items-center">
                    <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-user"></i>
                    <input
                      className="-mx-6 px-8  w-full border rounded px-3 py-2 bg-gray-700 focus:outline-none"
                      htmlFor="name"
                      id="name"
                      type="text"
                      placeholder="Enter Username"
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full mb-2">
                  <div className="flex items-center">
                    <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-user"></i>
                    <input
                      className="-mx-6 px-8  w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                      htmlFor="email"
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full mb-2">
                  <div className="flex items-center">
                    <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-user"></i>
                    <input
                      required
                      className="-mx-6 px-8  w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                      htmlFor="category"
                      id="category"
                      placeholder=" Enter Category for your Password like `tree`"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>
                {roundNumber !== ROUNDS_COUNT ? (
                  <button
                    className="w-full py-2 -ml-2.5 hover:bg-green-700 rounded-full bg-blue-900 text-gray-100  focus:outline-none"
                    type="submit"
                    onClick={() => {
                      if (roundNumber === 0 && !isHuman) {
                        setShowCaptcha(true);
                      } else {
                        getImages();
                      }
                    }}
                  >
                    Search Category
                  </button>
                ) : (
                  <button
                    className="w-full py-2 -ml-2.5 rounded-full bg-blue-900 text-gray-100 hover:bg-green-700 focus:outline-none"
                    type="button"
                    onClick={() => register()}
                  >
                    Confirm Registration
                  </button>
                )}
              </div>
            }
          </form>
        </div>
      </div>

      {roundNumber === ROUNDS_COUNT ? (
        <></>
      ) : (
        <>
          {roundNumber !== ROUNDS_COUNT && !isLoading && (
            <h2 className="text-3xl text-center text-gray-700 mb-4 p-5">
              Select Image for Graphical Password
            </h2>
          )}
          <div className=" bg-white rounded-lg  p-5">
            <ImageGrid
              ImageURLs={rawImages}
              thumbnails={thumbnails}
              addImageAndTileSequences={addImageAndTileSequences}
              numRounds={ROUNDS_COUNT}
              countTiles={TILES_COUNT}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </>
  );
}

export default RegistrationPage;
