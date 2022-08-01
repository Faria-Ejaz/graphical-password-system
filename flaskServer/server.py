import torch
import requests
from PIL import Image
from transformers import ViTFeatureExtractor, AutoTokenizer, VisionEncoderDecoderModel
import spacy
from collections import Counter
from string import punctuation


loc = "ydshieh/vit-gpt2-coco-en"

vi_feature_extractor = ViTFeatureExtractor.from_pretrained(loc)
auto_tokenizer = AutoTokenizer.from_pretrained(loc)
decorder_model = VisionEncoderDecoderModel.from_pretrained(loc)
decorder_model.eval()

nlp = spacy.load("en_core_web_sm")

def prediction(image):

    pixel_values = vi_feature_extractor(images=image, return_tensors="pt").pixel_values

    with torch.no_grad():
        output_img_ids = decorder_model.generate(pixel_values, max_length=16, num_beams=4, return_dict_in_generate=True).sequences

    preds = auto_tokenizer.batch_decode(output_img_ids, skip_special_tokens=True)
    preds = [pred.strip() for pred in preds]

    return preds

from flask import Flask
from flask import jsonify, request
  
app = Flask(__name__)
from flask_cors import CORS
cors = CORS(app)

@app.route('/image_captioning')

def text_prediction():

    args = request.args.to_dict()

    with Image.open(requests.get(args['img_url'], stream=True).raw) as image:
        preds = prediction(image)
    

    return jsonify(
        preds=preds,
    )


@app.route('/get_image_text')
# ‘/’ URL is bound with text_prediction() function.
def get_words():

    text = request.args.to_dict()['text']
    
    result = []
    pos_tag = ['PROPN', 'ADJ', 'NOUN'] # 1
    doc = nlp(text.lower()) # 2
    for token in doc:
        # 3
        if(token.text in nlp.Defaults.stop_words or token.text in punctuation):
            continue
        # 4
        if(token.pos_ in pos_tag):
            result.append(token.text)

    return {'words' : result} # 5


# main driver function
if __name__ == '__main__':
  
    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(debug=True)