import pandas as pd
import numpy as np
import pickle
import os
from flask_cors import cross_origin, CORS
from keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename

app = Flask(__name__)
cors = CORS(app)
model = load_model('../model/rice-leaf-detection-model.h5')

UPLOAD_FOLDER = 'static/'
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def mapper(value):
    if value == 0:
        return 'Blast'
    elif value == 1:
        return 'Blight'
    elif value == 2:
        return 'Tungro'

@app.route("/", methods=["GET", "POST"])
@cross_origin()

def index():
    if request.method == "GET":
        response = jsonify(message="Simple server is running")

        # Enable Access-Control-Allow-Origin
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    elif request.method == "POST":
        image = request.files["image"]
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        image=load_img(os.path.join(app.config['UPLOAD_FOLDER'], filename),target_size=(100,100))
        image=img_to_array(image) 
        image=image/255.0
        prediction_image=np.array(image)
        prediction_image= np.expand_dims(image, axis=0)
        prediction=model.predict(prediction_image)
        value=np.argmax(prediction)
        move_name=mapper(value)
        return format(move_name)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")