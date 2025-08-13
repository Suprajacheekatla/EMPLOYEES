from flask import Flask, request, jsonify, render_template # pip install flask
import psycopg2 # pip install psycopg2
from psycopg2 import sql

employee_application = Flask(__name__)

# Database connection configuration
DB_HOST = '127.0.0.1'
DB_NAME = 'postgres'
DB_USER = 'postgres'
DB_PASSWORD = 'postgres'

# Function to get a database connection
def get_db_connection():
    connection = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return connection

# Create the 'employees' table if it doesn't exist
def create_employees_table_if_not_exists():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            employee_id SERIAL PRIMARY KEY,
            employee_name TEXT NOT NULL,
            mobile_number TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            team TEXT NOT NULL
        );
    """)
    connection.commit()
    cursor.close()
    connection.close()

create_employees_table_if_not_exists()

@employee_application.route("/register-employee", methods=["POST"])
def register_employee():
    employee_name = request.json["employee_name"]
    mobile_number = request.json["mobile_number"]
    email = request.json["email"]
    team = request.json["team"]

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
            INSERT INTO employees (employee_name, mobile_number, email, team) VALUES (%s, %s, %s, %s);
        """, (employee_name, mobile_number, email, team))
    connection.commit()
    cursor.close()
    connection.close()

    response_json = {
        "message": "Successfully registered employee"
    }
    return jsonify(response_json)


@employee_application.route("/retrieve-single-employee", methods=["GET"])
def retrieve_single_employee():
    employee_id = request.args["employee_id"]

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
    SELECT * FROM employees WHERE employee_id = %s;
    """, (employee_id))
    employee_details = cursor.fetchone()
    cursor.close()
    connection.close()

    if employee_details:
        response_json = {
            "employee_id": employee_details[0],
            "employee_name": employee_details[1],
            "mobile_number": employee_details[2],
            "email": employee_details[3],
            "team": employee_details[4]
        }
        return jsonify(response_json)
    else:
        error_json = {
            "error": "Employee not found",
            "message": "Employee not found"
        }
        return jsonify(error_json)


@employee_application.route("/delete-employee", methods=["DELETE"])
def delete_employee():
    employee_id = request.args["employee_id"]

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
    DELETE FROM employees WHERE employee_id = %s;
    """, (employee_id))
    connection.commit()
    cursor.close()
    connection.close()

    response_json = {
        "message": "Successfully deleted employee"
    }
    return jsonify(response_json)


@employee_application.route("/update-employee", methods=["PUT"])
def update_employee():
    employee_id = request.args["employee_id"]

    employee_name = request.json["employee_name"]
    mobile_number = request.json["mobile_number"]
    email = request.json["email"]
    team = request.json["team"]

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
    UPDATE employees SET employee_name = %s, mobile_number = %s, email = %s, team = %s WHERE employee_id = %s;
    """, (employee_name, mobile_number, email, team, employee_id))
    connection.commit()
    cursor.close()
    connection.close()

    response_json = {
        "message": "Successfully updated employee"
    }
    return jsonify(response_json)

@employee_application.route("/", methods=["GET"])
def index():
    return render_template("index.html")

if __name__ == "__main__":
    employee_application.run(debug=True)