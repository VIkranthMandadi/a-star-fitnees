from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
import json

app = Flask(__name__)
CORS(app)

# Load secrets from the file
with open('secrets.json') as f:
    secrets = json.load(f)

uri = secrets['MONGODB_URI']
client = MongoClient(uri, ssl=True)
db = client['astarFitness']

# Route to create a user-specific collection
@app.route('/create-user-collection', methods=['POST'])
def create_user_collection():
    print("got here")
    data = request.json
    print(data)
    user_email = data.get('email')

    if not user_email:
        return jsonify({'error': 'Email is required'}), 400

    # Create a collection for the user using their email
    user_collection_name = f"user_{user_email.replace('@', '_').replace('.', '_')}"
    user_collection = db[user_collection_name]

    # Optional: Insert a welcome document or do other initial setup
    user_collection.insert_one({'message': 'Welcome to your collection!'})

    return jsonify({'message': 'User collection created', 'collection': user_collection_name})

@app.route('/')
def home():
    return jsonify({"message": "CORS-enabled Flask backend!"})

if __name__ == '__main__':
    app.run(port=8000, debug=True)