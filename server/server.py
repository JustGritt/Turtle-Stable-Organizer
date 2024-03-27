import os
import uuid
from flask import Flask, json, request, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Load the settings from the settings.json file
if os.path.exists("settings.json"):
    with open("settings.json", "r") as f:
        settings = json.load(f)
        for key, value in settings.items():
            os.environ[key] = value
            print(f"Loaded {key} from settings.json: {value}")

# Environment variables
UPLOAD_DIR = os.getenv("UPLOAD_DIR")
OUTPUT_DIR = os.getenv("OUTPUT_DIR")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and \
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
@app.route("/images")
def get_images():
    image_files = [f for f in os.listdir(UPLOAD_DIR) if allowed_file(f)]
    image_files += [f for f in os.listdir(OUTPUT_DIR) if allowed_file(f)]
    image_urls = [f"/image/{f}" for f in image_files]
    return jsonify(image_urls)

@app.route("/images/<image_filename>")
def get_image(image_filename):
    image_path = os.path.join(UPLOAD_DIR, image_filename)
    output_path = os.path.join(OUTPUT_DIR, image_filename)
    if os.path.isfile(image_path):
        return send_from_directory(UPLOAD_DIR, image_filename)
    elif os.path.isfile(output_path):
        return send_from_directory(OUTPUT_DIR, image_filename)
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

@app.route("/update-settings", methods=["POST"])
def update_settings():
    # Get the JSON payload from the request body
    data = request.get_json()

    # Update the settings accordingly
    for key, value in data.items():
        os.environ[key] = value

    # Save the updated settings to the settings.json file
    with open("settings.json", "w") as f:
        json.dump(data, f)

    return 'Settings updated successfully'

if __name__ == "__main__":
    app.run(debug=True)
