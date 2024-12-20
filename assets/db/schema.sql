-- Create a new database
DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

\c business_db;

-- Create a department table
CREATE TABLE department (
    id Serial PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create a role table
CREATE TABLE role (
    id Serial PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) on delete set null
);

-- Create an employee table
CREATE TABLE employee (
    id Serial PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER DEFAULT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id) on delete set null,
    FOREIGN KEY (manager_id) REFERENCES employee(id) on delete set null
);
-- need and secondary keys