/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import  Modal  from "../Modal";
import { XCircle } from "react-feather";
import { AnimatePresence, motion } from "framer-motion";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Grid = (props) => {

  const Box2 = ({ children }) => (
    <a
      style={{
        border: "1px solid #ccc",
        display: "block",
        fontSize: 16,
        lineHeight: 2,
        padding: 20,
        marginBottom: 10,
        width: 100,
      }}
    >
      {children}
    </a>
  );

  // const submitSequences = (seq) => console.log(seq);

  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(false);
  const [, setCurrentImgIndex] = useState(null);

  return (
    <>
      <div className="flex flex-col">
        <div className=" grid grid-cols-2 lg:grid-cols-4">
          {props.images.map((img, index) => (
            <div key={img.id}>
              {props.isLoading ? (
                <SkeletonTheme
                  baseColor="#5294e0"
                  highlightColor="#a1cdff"
                  borderRadius="0.25rem"
                  duration={1}
                >
                  <Skeleton circle count={5} wrapper={Box2} />
                </SkeletonTheme>
              ) : (
                <motion.img
                  layoutId={index}
                  htmlFor="my-modal"
                  className="modal-button rounded-xl mt-5"
                  src={`${img.thumbnail}&t=${Date.now()}`}
                  onClick={() => {
                    setShowModal(true);
                    setCurrentImage(img.src);
                    setCurrentImgIndex(index);
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.1 }}
                  transition={{
                    duration: 0.75,
                  }}
                  whileHover={{ scale: 2 }}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence exitBeforeEnter>
          {showModal ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, }}
                transition={{ duration: 0.75 }}
                exit={{ opacity: 0 }}
                className="flex bg-blue-900 justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
                <motion.div className="relative w-auto mx-auto bg-gray-300 ">
                  <motion.div className="border-0 bg-gray-300 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <motion.div className="flex items-start justify-between p-2 rounded-t ">
                      <motion.button
                        className="bg-transparent border-0 text-black float-right"
                        onClick={() => setShowModal(false)}
                      >
                        <motion.span className="h-6 w-6 text-3xl block text-red-700">
                          <XCircle /> 
                        </motion.span>
                      </motion.button>
                    </motion.div>
                    <motion.div className="relative p-2 flex-auto">
                      <Modal
                        imageURL={currentImage}
                        dimension={250}
                        ImgResolution={5}
                        submitSequences={props.addImageAndTileSequences}
                        countTiles={props.countTiles}
                        closeModal={() => setShowModal(false)}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Grid;
