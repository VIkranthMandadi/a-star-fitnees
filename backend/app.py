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


@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.json
    user_email = data.get('email')
    profile_data = data.get('profileData')

    if not user_email or not profile_data:
        return jsonify({'error': 'Email and profile data are required'}), 400

    user_collection_name = f"user_{user_email.replace('@', '_').replace('.', '_')}"
    user_collection = db[user_collection_name]

    user_collection.update_one(
        {'profile': 'data'},
        {'$set': profile_data},
        upsert=True
    )

    return jsonify({'message': 'Profile updated successfully'})

@app.route('/get-profile', methods=['POST'])
def get_profile():
    data = request.json
    user_email = data.get('email')

    if not user_email:
        return jsonify({'error': 'Email is required'}), 400

    user_collection_name = f"user_{user_email.replace('@', '_').replace('.', '_')}"
    user_collection = db[user_collection_name]

    # Find the profile data
    profile_data = user_collection.find_one({'profile': 'data'}, {'_id': 0})  # Exclude _id field

    if not profile_data:
        return jsonify({'message': 'Profile not found', 'profileData': None}), 404

    return jsonify({'message': 'Profile found', 'profileData': profile_data})


@app.route('/get-premade-workouts', methods=['GET'])
def get_premade_workouts():
    # Fetch all documents from the PremadeWorkouts collection
    workouts_collection = db['PremadeWorkouts']
    workouts = list(workouts_collection.find({}, {'_id': 0}))  # Exclude _id field

    return jsonify(workouts)

@app.route('/update-plan', methods=['POST'])
def update_plan():
    data = request.json
    user_email = data.get('email')
    workout = data.get('workout')

    if not user_email or not workout:
        return jsonify({'error': 'Email and workout data are required'}), 400

    # Create a collection for the user using their email
    user_collection_name = f"user_{user_email.replace('@', '_').replace('.', '_')}"
    user_collection = db[user_collection_name]

    # Check if the user already has a plan document
    plan = user_collection.find_one({"plan": "workouts"})

    if plan:
        # If the plan exists, update the workouts array by adding the new workout
        user_collection.update_one(
            {"plan": "workouts"},
            {"$push": {"workouts": workout}}
        )
    else:
        # If the plan doesn't exist, create a new document with the workout
        user_collection.insert_one(
            {"plan": "workouts", "workouts": [workout]}
        )

    return jsonify({'message': 'Workout added to plan successfully'})

@app.route('/get-user-workouts', methods=['GET'])
def get_user_workouts():
    user_email = request.args.get('email')
    print(f"Received email: {user_email}")  # Debug log

    if not user_email:
        return jsonify({'error': 'Email is required'}), 400

    user_collection_name = f"user_{user_email.replace('@', '_').replace('.', '_')}"
    user_collection = db[user_collection_name]

    plan = user_collection.find_one({"plan": "workouts"}, {'_id': 0, 'workouts': 1})
    print(f"Fetched plan: {plan}")  # Debug log

    if not plan or 'workouts' not in plan:
        return jsonify({'message': 'No workouts found for the user', 'workouts': []}), 200

    return jsonify({'message': 'Workouts found', 'workouts': plan['workouts']})

# Fetch the scheduled workout for a specific day
@app.route('/workouts/scheduled', methods=['GET'])
def get_scheduled_workout():
    user_email = request.args.get('email')
    day = request.args.get('day')

    if not user_email or not day:
        return jsonify({'error': 'Email and day are required'}), 400

    user_collection_name = f"user_{user_email.replace('@', '_').replace('.', '_')}"
    user_collection = db[user_collection_name]

    # Find the scheduled workout for the specified day
    scheduled_workout = user_collection.find_one({'scheduled_day': day}, {'_id': 0, 'workout': 1})

    if not scheduled_workout:
        return jsonify({'message': 'No workout scheduled for this day', 'scheduledWorkout': None}), 200

    return jsonify({'message': 'Scheduled workout found', 'scheduledWorkout': scheduled_workout['workout']})

# Schedule a workout for a specific day
@app.route('/workouts/schedule', methods=['POST'])
def schedule_workout():
    data = request.json
    user_email = data.get('email')
    day = data.get('day')
    workout_id = data.get('workoutId')

    if not user_email or not day or not workout_id:
        return jsonify({'error': 'Email, day, and workout ID are required'}), 400

    user_collection_name = f"user_{user_email.replace('@', '_').replace('.', '_')}"
    user_collection = db[user_collection_name]

    # Check if a workout is already scheduled for the day
    existing_schedule = user_collection.find_one({'scheduled_day': day})

    if existing_schedule:
        # Update the workout for the existing day
        user_collection.update_one({'scheduled_day': day}, {'$set': {'workout': workout_id}})
    else:
        # Insert a new document with the workout scheduled for the day
        user_collection.insert_one({'scheduled_day': day, 'workout': workout_id})

    return jsonify({'message': 'Workout scheduled successfully'})



@app.route('/')
def home():
    return jsonify({"message": "CORS-enabled Flask backend!"})

if __name__ == '__main__':
    app.run(port=8000, debug=True)