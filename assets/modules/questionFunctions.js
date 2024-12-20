const inquirer = require("inquirer");
const {Pool} = require('pg');
const dotenv = require('dotenv');

//setup env
dotenv.configure();

//setup pool from pg and database
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
  });
  //try and connect to database
  exports.connectToDb = async () => {
    try {
      await pool.connect();
      console.log('Connected to the database.');
    } catch (err) {
      console.error('Error connecting to database:', err);
      process.exit(1);
    }
  };

//IMPORTANT NOTE: the functions break normal naming convention because it makes it easy to call them from object by inputing them into object and calling that function.
//functions for questionFunctions module
exports.ViewAllEmployees = async function(){};
exports.AddEmployee = async function(){};
exports.UpdateEmployeeRole = async function(){};
exports.ViewAllRoles = async function(){};
exports.AddRole = async function(){};
exports.ViewAllDepartments = async function(){};
exports.AddDepartment = async function(){};

