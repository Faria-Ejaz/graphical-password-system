export const imageText = async (imageUrl) => {
  return new Promise(async (resolve, reject) => {
    let words = [];
    try {
      fetch(`http://127.0.0.1:5000/image_captioning?img_url=${imageUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((data) => data.json())

        .then(async (res) => {
          let text = res.preds[0];
          fetch(`http://127.0.0.1:5000/get_image_text?text=${text}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((textData) => textData.json())
            .then((res) => {
              words = res.words;
              for (var i = 0; i < words.length; i++) {
                text = text.replace(words[i], "___");
              }
              resolve({ text: text });
            });
        });
    } catch (err) {}
  });
};
