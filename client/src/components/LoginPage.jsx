/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from "react";
import axios from "axios";
import { ImageGrid } from "./imageGrid";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { navigate } from "@reach/router";
import DrawingCanvas from "./DrawingCanvas";
import classnames from "classnames";

const TILES_COUNT = Number(process.env.REACT_APP_TOTAL_TILES_COUNT);
const ROUNDS_COUNT = Number(process.env.REACT_APP_TOTAL_ITERATION_COUNT);

function hashingSHA(image, ref_point) {
  const str = image + ref_point.join();
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.base64);
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [imageText, setImageText] = useState("");
  const [roundNumber, setRoundNumber] = useState(0);
  const [images, setImages] = useState([]);
  const sequences = useRef([]);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const handleSubmit = async () => {
    // fetching first round images
    if (roundNumber === 0) {
      try {
        const res = await axios.post(
          "http://localhost:4000/api/login",
          {
            email: email,
            counter: roundNumber,
            passwordHash: "",
            key: "",
          },
          { "Content-Type": "application/json" }
        );

        if (res.status === 200) {
          setImages(res.data.images);
          setImageText(res.data.passwordHint);
          setRoundNumber((prev) => prev + 1);
        }
      } catch (err) {
        toast.error("this email is not registered yet");
      }
    }

    // middle rounds
    else if (roundNumber < ROUNDS_COUNT) {
      try {
        const currentSequences = sequences.current[sequences.current.length - 1];
        const res = await axios.post(
          "http://localhost:4000/api/login",
          {
            email: email,
            counter: roundNumber,
            passwordHash: "",
            key: hashingSHA(
              currentSequences.image,
              currentSequences.tileSequences
            ),
          },
          { "Content-Type": "application/json" }
        );

        if (res.status === 200) {
          setImageText(res.data.passwordHint);
          setImages(res.data.images);
          setRoundNumber((prev) => prev + 1);
        }
      } catch (err) {
        console.error("err", err);
      }
    }

    // last round
    else if (roundNumber === ROUNDS_COUNT) {
      const hashes = [];
      sequences.current.map((imageSelection) => {
        hashes.push(
          hashingSHA(imageSelection.image, imageSelection.tileSequences)
        );
      });

      const passwordHash = CryptoJS.SHA256(hashes.join()).toString(
        CryptoJS.enc.base64
      );

      const currentSequences = sequences.current[sequences.current.length - 1];
      try {
        const res = await axios.post(
          "http://localhost:4000/api/login",
          {
            email: email,
            counter: roundNumber,
            passwordHash: passwordHash,
            key: hashingSHA(
              currentSequences.image,
              currentSequences.tileSequences
            ),
          },
          { "Content-Type": "application/json" }
        );
        if (res.status === 200) {
          toast.success(res?.data?.msg);
          navigate("/authenticated");
        } else if (res.status === 404 || res.status === 204) {
          toast.warning("this email is not registered yet");
          navigate("/authenticated");
        }
      } catch (err) {
        if (err.response.status === 401) {
          toast.error(err?.response?.data?.msg);
          setRoundNumber(0);
          setIsHuman(false);
          setImages([]);
          sequences.current = [];
        } else {
          toast.error("Server error");
        }
      }
    }
  };

  const addImageAndTileSequences = (image, tileSequences) => {
    sequences.current.push({
      image,
      tileSequences,
    });
    setImages([]);
    handleSubmit();
  };

  return (
    <div>
      <DrawingCanvas
        modalIsOpen={showCaptcha}
        setIsOpen={setShowCaptcha}
        onResult={(captchaResult) => {
          if (captchaResult) {
            setIsHuman(true);
            handleSubmit();
          } else {
            toast.warning("Are you human? Please try again");
          }
          setShowCaptcha(false);
        }}
      />

      <div className="bg-blue-900">
        <div
          className={classnames("w-full flex items-center justify-center", {
            "h-screen": images.length === 0,
          })}
        >
          <form
            className="w-full md:w-1/3 bg-white rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
              roundNumber === 0 && !isHuman && handleSubmit();
            }}
          >
            <div className="flex font-bold justify-center mt-6">
              <img
                className="h-20 w-20"
                src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/avatar.svg"
              ></img>
            </div>
            <h2 className="text-3xl text-center text-gray-700 mb-4">Sign In</h2>
            <div className="px-12 pb-10">
              <div className="w-full mb-2">
                <div className="flex items-center">
                  <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-user"></i>
                  <input
                    className="-mx-6 px-8  w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                    htmlFor="email"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {roundNumber === 0 && (
                <button
                  className="w-full py-2 -ml-2.5 hover:bg-green-700 rounded-full bg-blue-900 text-gray-100  focus:outline-none"
                  type="submit"
                >
                  LOGIN
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {images.length > 0 && (
        <>
          <h2 className="text-3xl text-center text-gray-700 mb-4 p-5 font-bold">
            Select Graphical Password
          </h2>
          <div>
            <p className="text-center p-3">
              <b>Password Hint:</b>
              <br />
              {imageText}
            </p>
          </div>
        </>
      )}
      <div className=" bg-white rounded-lg p-5">
        <ImageGrid
          ImageURLs={images}
          thumbnails={images}
          addImageAndTileSequences={addImageAndTileSequences}
          numRounds={ROUNDS_COUNT}
          countTiles={TILES_COUNT}
        />
      </div>
    </div>
  );
}

export default LoginPage;
