from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, storage
import time


cred = credentials.Certificate("./database.json")
firebase_admin.initialize_app(cred, {
    "storageBucket": "microphone-4692d.appspot.com"
})

bucket = storage.bucket()


app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

@app.route('/api/upload', methods=['POST'])
def upload_audio():
    try:
        file = request.files['file']
        # Generate a unique filename with timestamp
        unique_filename = f"audio_{int(time.time())}_{file.filename}"
        
        # Upload to Firebase Storage
        blob = bucket.blob(f"audio/{unique_filename}")
        blob.upload_from_file(file)
        
        # Optionally make the file public
        blob.make_public()
        
        return jsonify({"message": "File uploaded successfully", "url": blob.public_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify(message="Hello from Flask!")

if __name__ == "__main__":
    app.run(debug=True)
    
