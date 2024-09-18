from flask import Flask, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
import json

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)
with open('secrets.json') as f:
    secrets = json.load(f)

uri = secrets['MONGODB_URI']

# MongoDB connection setup
client = MongoClient(uri)  # Replace with your MongoDB URI
db = client['mydatabase']  # Replace with your database name
collection = db['mycollection']  # Replace with your collection name

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Sample route to retrieve data from MongoDB
@app.route('/data', methods=['GET'])
def get_data():
    data = collection.find()
    result = []
    for item in data:
        # MongoDB returns an ObjectId, convert it to string to return in JSON
        item['_id'] = str(item['_id'])
        result.append(item)
    return jsonify(result)

# Sample route to insert data into MongoDB
@app.route('/data', methods=['POST'])
def insert_data():
    data = request.json
    inserted_id = collection.insert_one(data).inserted_id
    return jsonify({'message': 'Data inserted', 'id': str(inserted_id)})

@app.route('/')
def home():
    return jsonify({"message": "CORS-enabled Flask backend!"})

if __name__ == '__main__':
    # Run the app on the local development server
    # print(get_question("sarthak is a genius", "sarthak"))
    app.run(port=8000, debug=True)
