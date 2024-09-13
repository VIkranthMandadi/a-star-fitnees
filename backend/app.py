from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "CORS-enabled Flask backend!"})

if __name__ == '__main__':
    # Run the app on the local development server
    # print(get_question("sarthak is a genius", "sarthak"))
    app.run(port=8000, debug=True)
