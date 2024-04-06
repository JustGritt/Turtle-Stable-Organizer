import os
import uuid
from flask import Flask, json, request, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5000"])

# Load the settings from the settings.json file
def load_settings():
    if not os.path.exists("settings.json"):
        return "settings.json does not exist or is not readable."

    with open("settings.json", "r") as f:
        settings = json.load(f)

    for key, value in settings.items():
        os.environ[key] = value if os.name != 'nt' else value.replace("\\", "/")
        print(f"Loaded {key} from settings.json: {value}")

        if key == "OUTPUT_DIR":
            global OUTPUT_DIR
            OUTPUT_DIR = value

        if key == "UPLOAD_DIR":
            global UPLOAD_DIR
            UPLOAD_DIR = value

    return "Settings loaded successfully."
load_settings()

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
    limit = request.args.get('limit', default = 10, type = int)
    page = request.args.get('page', default = 1, type = int)
    offset = (page - 1) * limit

    image_files = []
    try:
        image_files = [f for f in os.listdir(UPLOAD_DIR) if allowed_file(f)]
    except Exception as e:
        print(f"Failed to load images from UPLOAD_DIR: {e}")

    settings = {}
    if os.path.exists("settings.json"):
        with open("settings.json", "r") as f:
            settings = json.load(f)

    output_dir = settings.get("OUTPUT_DIR")
    if output_dir and os.path.exists(output_dir):
        try:
            output_images = [f for f in os.listdir(output_dir) if allowed_file(f)]
            image_files += output_images
        except Exception as e:
            print(f"Failed to load images from OUTPUT_DIR: {e}")

    image_files = image_files[offset:offset+limit]

    image_urls = [f"/images/{f}" for f in image_files]
    return jsonify(image_urls)

@app.route("/images/<image_filename>")
def get_image(image_filename):
    for directory in [UPLOAD_DIR, OUTPUT_DIR]:
        image_path = os.path.join(directory, image_filename).replace("\\", "/")
        if os.path.isfile(image_path):
            return send_from_directory(directory, image_filename)
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

@app.route("/settings", methods=["GET"])
def get_settings():
    try:
        with open("settings.json", "r") as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        return "Error: settings.json does not exist", 404
    except json.JSONDecodeError:
        return "Error: settings.json is not valid JSON", 400

@app.route("/settings", methods=["POST"])
def update_settings():
    data = request.get_json()
    print(data)

    for key, value in data.items():
        os.environ[key] = value

    with open("settings.json", "w") as f:
        json.dump(data, f)

    # Reload the settings
    load_settings()
    return 'Settings updated successfully'

if __name__ == "__main__":
    app.run(debug=True)
