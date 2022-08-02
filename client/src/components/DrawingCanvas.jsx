/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import Modal from 'react-modal';
import { createWorker } from "tesseract.js"
import { Buffer } from 'buffer';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    width: '40vw',
    border: 'none',
    borderRadius: '10px',
  },
};
function DrawingCanvas({ modalIsOpen, setIsOpen, onResult, className }) {
  const canvasRef = useRef(null);
  const rand = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  const handleSubmit = async () => {

    const data = canvasRef.current.canvasContainer.children[1].toDataURL();
    let imageBuffer = Buffer.from(data.slice(22), "base64");
    const worker = await createWorker({});
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789',
    });
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();

    if(text.match(rand)){
      onResult(true);
    }
    else{
      onResult(false);
    }

    closeModal()
  };

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="bg-blue-900">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >

        <div className="overflow-auto mx-auto " >
          <div className="flex">
            <p className="mx-auto font-bold text-lg text-center  text-gray-700 mb-4">Please draw <b className="text-2xl">{rand}</b> below</p>
          </div>
          <CanvasDraw ref={canvasRef} hideGrid={true} className="mx-auto bg-white" />
          <div className="flex">
            <a onClick={() => handleSubmit()} className="btn ml-auto mt-4 w-full rounded-full border-none bg-blue-900 text-gray-100 hover:bg-green-700">Submit</a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DrawingCanvas;