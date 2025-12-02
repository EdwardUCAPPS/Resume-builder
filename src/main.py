from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os
import sqlite3

# Load environment variables
load_dotenv()

# Initialize Hugging Face InferenceClient
client = InferenceClient(
    os.getenv('HG_NAME'),
    token=os.getenv('HG_API_KEY'),
)

app = Flask(__name__)
cors = CORS(app, origins='*')
# CORS(app)

# Function to execute sql queries
def sqlquery(query):
    connection = sqlite3.connect('test.db')
    cursor = connection.cursor()
    cursor.execute(query)
    connection.commit()
    values  = cursor.fetchall()
    connection.close()
    return values

# Function to input and get response from AI
def get_response(prompt):
    prompts = [{"role": "user", "content": prompt}]
    result = ''
    for message in client.chat_completion(
        prompts,
        max_tokens=500,
        stream=True,
    ):
        result += message.choices[0].delta.content
    return result

# Handle generating the resume and cover letter
@app.route('/api/main', methods=['GET', 'POST'])
def submit_data():
    if request.method == 'POST':
        # Handle POST request
        data = request.json
        if not data:
            return jsonify({"error": "Invalid or no data provided"}), 400

        document_type = data.get('documentType')
        person_description = data.get('personDescription')
        job_description = data.get('jobDescription')

        prompt = "Don't give me any suggestions or notes or say 'Here is the " + document_type + "', just give me the " + document_type + " and nothing more. Begin with 'Dear Hiring Manager' immediately. No need to sign off."
        prompt += "Using my resume/cover letter: " + person_description + "\n" + \
          "Create a " + document_type + "\n" + \
          "for this job: " + job_description
          
        result = get_response(prompt)
        
        instructionPrompt = "Give me just the answer, no need for a sentence. If you cannot find out or recognize it is not a job posting, say 'NO'\n"
        prompt = "What is the job title for this job?: " + job_description
        jobTitle = get_response(instructionPrompt + prompt)
        
        prompt = "What is the company of this job?: " + job_description
        companyName = get_response(instructionPrompt + prompt)

        return jsonify({"message": "Data received successfully!", "prompt": prompt, "result": result, "jobTitle": jobTitle, "companyName": companyName})

    elif request.method == 'GET':
        # Handle GET request (if needed)
        return jsonify({"message": "Data sent successfully!", "result": "Loading.."})

# Handle getting and editing profile information
@app.route('/database/profile', methods=['GET', 'POST'])
def handle_profile():
    if request.method == 'POST':
        # Handle POST request
        data = request.json
        if not data:
            return jsonify({"error": "Invalid or no data provided"}), 400

        id = data.get('id')
        email = data.get('email')
        # password = data.get('password')
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        major = data.get('major')
        university = data.get('university')
        address = data.get('address')
        phoneNumber = data.get('phoneNumber')

        # Update user data into the database
        query = "UPDATE users" + \
            "\nSET email = '" + email + "', firstName = '" + firstName + "', lastName = '" + lastName + "', major = '" + major + "', university = '" + university + "', address = '" + address + "', phoneNumber = '" + phoneNumber + "'" + \
            "\nWHERE id = " + str(id) + ";"
            
        sqlquery(query)
        
        return jsonify({"message": "Data updated successfully!"})
    
    elif request.method == 'GET':
        # Get the 'id' from query parameters
        id = request.args.get('id')

        if not id:
            return jsonify({"error": "ID parameter is missing"}), 400

        # Execute the query to fetch user details from database
        query = "SELECT email, password, firstName, lastName, major, university, address, phoneNumber" + \
            "\nFROM users" + \
            "\nWHERE id = " + str(id)
        
        user = sqlquery(query)

        if user:
            # Convert tuple to dictionary
            user_data = {
                "email": user[0][0],
                "password": user[0][1],
                "firstName": user[0][2],
                "lastName": user[0][3],
                "major": user[0][4],
                "university": user[0][5],
                "address": user[0][6],
                "phoneNumber": user[0][7]
            }
            return jsonify(user_data)
        else:
            return jsonify({"error": "User not found"}), 404

# Handle logins
@app.route('/database/login', methods=['POST'])
def handle_login():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid or no data provided"}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Query to check if the username and password are correct
    query = f"SELECT id FROM users WHERE email = '{username}' AND password = '{password}'"
    
    user = sqlquery(query)
    
    if user:
        return jsonify({"message": "Login successful!", "userID": user[0][0]})
    else:
        return jsonify({"error": "Invalid username or password"}), 401
    
# Handle sign ups
@app.route('/database/signup', methods=['POST'])
def handle_signup():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid or no data provided"}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if email already exists
    query_check = f"SELECT COUNT(*) FROM users WHERE email = '{email}'"
    user_count = sqlquery(query_check)

    if user_count[0][0] > 0:
        return jsonify({"error": "Email already exists"}), 409

    # Insert new user into the database
    query_insert = f"INSERT INTO users (email, password) VALUES ('{email}', '{password}')"
    
    try:
        sqlquery(query_insert)
        return jsonify({"message": "Signup successful!"})
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Handle generating the resume from scratch
@app.route('/api/resumepage', methods=['POST'])
def submit_data_resume():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid or no data provided"}), 400

    name = data.get('name')
    email = data.get('email')
    phoneNumber = data.get('phoneNumber')
    address = data.get('address')
    university = data.get('university')
    major = data.get('major')
    workExperience = data.get('workExperience')
    skills = data.get('skills')

    prompt = ''
    prompt += "Create a resume using my: " + \
        "Name: " + name + "\n" + \
        "Email: " + email + "\n" + \
        "Phone number: " + phoneNumber + "\n" + \
        "Address: " + address + "\n" + \
        "University: " + university + "\n" + \
        "Major: " + "\n" + major + \
        "Work experience: " + workExperience + "\n" + \
        "Skills: " + "\n" + skills
        
    result = get_response(prompt)

    return jsonify({"message": "Data received successfully!", "prompt": prompt, "result": result})

# Handle getting all the documents history
@app.route('/database/favorites', methods=['GET', 'DELETE'])
def handle_favorites():
    if request.method == 'GET':
        # Handle GET request
        user_id = request.args.get('id')
        if not user_id:
            return jsonify({"error": "User ID not provided"}), 400

        query = "SELECT document_id, user_id, document_type, content, created_at, job_title, company_name" + \
            "\nFROM documents" + \
            "\nWHERE user_id = " + user_id + \
            "\nORDER BY created_at DESC"
            
        documents = sqlquery(query)
            
        if documents:
            # Convert tuple list to list of dictionaries
            documents_list = []
            # print(documents)
            
            for doc in documents:
                documents_list.append({
                    "document_id": doc[0],
                    "user_id": doc[1],
                    "document_type": doc[2],
                    "content": doc[3],
                    "created_at": doc[4],
                    "job_title": doc[5],
                    "company_name": doc[6],
                })
            return jsonify({"documents": documents_list}), 200
        else:
            return jsonify({"error": "No documents found for this user"}), 404
    elif request.method == 'DELETE':
        # Handle DELETE request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid or no data provided"}), 400

        user_id = data.get('user_id')
        document_id = data.get('document_id')
        
        if not user_id or not document_id:
            return jsonify({"error": "User ID and Document ID are required"}), 400


        user_id = data.get('user_id')
        document_id = data.get('document_id')
        
        # print(type(user_id), type(document_id))
        
        query = "DELETE FROM documents" + \
            "\nWHERE user_id = " + str(user_id) + " AND document_id = " + str(document_id)
            
        sqlquery(query)
        
        return jsonify({"message": "Data updated successfully!"}), 200
        
@app.route('/database/favoriting', methods=['POST'])
def handle_favoriting():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Invalid or no data provided"}), 400

    user_id = data.get('user_id')  
    document_type = data.get('documentType')
    content = data.get('result') 
    job_title = data.get('jobTitle')
    company_name = data.get('companyName')

    if not all([user_id, document_type, content, job_title, company_name]):
        return jsonify({"error": "Missing required fields"}), 400

    query = "INSERT INTO documents (user_id, document_type, content, job_title, company_name)" + \
        "\nVALUES (" + str(user_id) + ", \"" + document_type + "\", \"" + content + "\", \"" + job_title + "\", \"" + company_name + "\")"

    sqlquery(query)
    
    return jsonify({"message": "Data submitted successfully"}), 200
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)