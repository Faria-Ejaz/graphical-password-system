import React from "react";
import Grid from "./Grid";

function ImageGrid(props) {
  const images = [];
  const thumbnailSide = 256;

  for (let i = 0; i < props.ImageURLs.length; i++) {
    images.push({
      id: i + 1,
      src: props.ImageURLs[i],
      thumbnail: props.thumbnails[i],
      thumbnailHeight: thumbnailSide,
      thumbnailWidth: thumbnailSide,
    });
  }

  return (
    <div className="mx-8">
      <Grid
        images={images}
        addImageAndTileSequences={props.addImageAndTileSequences}
        numRounds={props.numRounds}
        countTiles={props.countTiles}
        isLoading={props.isLoading}
      />
    </div>
  );
}

export default ImageGrid;
