/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

function Modal({
  imageURL,
  dimension,
  ImgResolution,
  submitSequences,
  countTiles,
  closeModal,
}) {
  const selectedTiles = useRef([]);

  const handleTileClick = (e) => {
    const selectedTile = document.getElementById(e.target.id);
    const selectedTileId = e.target.id;
    if (
      selectedTiles.current.includes(selectedTileId) ||
      selectedTiles.current.length >= countTiles
    ) {
      return;
    } else {
      selectedTile.classList.add("border-2");
      selectedTile.classList.add("border-red-500");
      selectedTiles.current.push(selectedTileId);
    }
  };

  useEffect(() => {
    let image = new Image(dimension, dimension);
    image.src = imageURL;
    image.crossOrigin = "anonymous";

    const gridContainer = document.querySelector("#selection-grid");

    let tileDimension = dimension / ImgResolution;
    image.addEventListener("load", () => {
      for (let row = 0, y = 0; y < dimension; y += tileDimension, row++) {
        for (let col = 0, x = 0; x < dimension; x += tileDimension, col++) {
          const canvas = document.createElement("canvas");
          canvas.width = tileDimension;
          canvas.height = tileDimension;
          canvas.id = `${row}_${col}`;
          canvas.addEventListener("click", handleTileClick);
          const ctx = canvas.getContext("2d");

          ctx.drawImage(image, x, y, 100, 100, 0, 0, 100, 100);
          gridContainer.appendChild(canvas);
        }
      }
    });
  }, [imageURL, dimension, ImgResolution, handleTileClick]);

  return (
    <div className="mx-auto flex flex-col">
      <span className="mx-auto font-bold text-lg text-center text-gray-700 mb-4 p-5">
        Select <b className="text-2xl">3</b> cubes from the image below 
        for Graphical Password Authentication.
      </span>
      <div
        id="selection-grid"
        className="grid grid-cols-5 gap-x-0 gap-y-2 w-96 mx-auto"
      ></div>

      {/* btn-disabled is not working, but it's handled in submitSequences */}
      <button
        className={`py-2 m-5 rounded-full bg-blue-900 text-gray-100 hover:bg-green-700 ${
          selectedTiles.length === countTiles ? "btn-disabled" : ""
        }`}
        onClick={() => {
          if (selectedTiles.current.length !== countTiles) {
            toast.warn(`Select ${countTiles} tile(s)`);
            return;
          }
          submitSequences(imageURL, selectedTiles.current);

          closeModal();
        }}
      >
        Submit Password
      </button>
    </div>
  );
}

export default Modal;
