import os
import uuid
from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Environment variables
UPLOAD_DIR = os.getenv("UPLOAD_DIR")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and \
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/images")
def get_images():
    image_files = [f for f in os.listdir(UPLOAD_DIR) if allowed_file(f)]
    image_urls = [f"/image/{f}" for f in image_files]
    return jsonify(image_urls)

@app.route("/image/<image_filename>")
def get_image(image_filename):
    image_path = os.path.join(UPLOAD_DIR, image_filename)
    if os.path.isfile(image_path):
        return send_from_directory(UPLOAD_DIR, image_filename)
    else:
        return "Image not found", 404

@app.route("/upload", methods=["POST"])
def upload_image():
    uploaded_file = request.files.get("file")
    if not uploaded_file or not allowed_file(uploaded_file.filename):
        return "Invalid file type. Only PNG, JPEG, or JPG allowed.", 400

    filename = secure_filename(uploaded_file.filename)
    ext = os.path.splitext(filename)
    unique_filename = uuid.uuid4().hex + ext[1]
    uploaded_file.save(os.path.join(UPLOAD_DIR, unique_filename))
    return jsonify({"message": "File uploaded successfully", "filename": unique_filename})

if __name__ == "__main__":
    app.run(debug=True)
