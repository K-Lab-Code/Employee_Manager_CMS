import inquirer from "inquirer";
import {Pool} from 'pg';
import dotenv from 'dotenv';

//setup env
dotenv.config();
//setup object for exporting
const exp = {};

//setup pool from pg and database
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
  });
  //try and connect to database
  exp.connectToDb = async () => {
    try {
      await pool.connect();
      console.log('Connected to the database.');
    } catch (err) {
      console.error('Error connecting to database:', err);
      process.exit(1);
    }
  };

//private Dictonaries
let getRoleID = {};
let getManagerID = {};
let getFirstName = {};
let getLastName = {};
let getDepartmentID = {};
//private functions
async function rolesList() {
  pool.query(`select * from role`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows);
    }
  });
}
async function managerList() {

}
async function employeeList() {

}
async function departmentList(){

}
//IMPORTANT NOTE: the functions break normal naming convention because it makes it easy to call them from object by inputing them into object and calling that function.
//functions for questionFunctions module
exp.ViewAllEmployees = async function(){
  pool.query(`select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id as manager from employee join role on employee.role_id = role.id join department on role.department_id = department.id`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows);
    }
  });
};
exp.AddEmployee = async function(){
  inquirer.prompt([
    {
      type:'input',
      message: "What is the employee's first name?",
      name: 'firstName'
  }, {
    type:'input',
    message: "What is the employee's last name?",
    name: 'lastName'
  }, {
    type:'choice',
    message: "What is the employee's role",
    name: 'role',
    choice: await rolesList()
  }, {
    type:'choice',
    message: "Who is the employee's manager",
    name: 'manager',
    choice: await managerList()
  }
  ]).then((answers)=>{
    pool.query(`insert into employee (first_name, last_name, role_id, manager_id) values ($1, $2, $3, $4)`, [answers.firstName, answers.lastName, getRoleID[answers.role], getManagerID[answers.manager]], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Added ${answers.firstName} ${answers.lastName} to the database`);
      }
    });
  });
};
exp.UpdateEmployeeRole = async function(){
  inquirer.prompt([
    {
      type:'choice',
      message: "Which employee role are you updating",
      name: 'name',
      choice: await employeeList()
  }, {
    type:'choice',
    message: "Which role do you want to assign the employee",
    name: 'role',
    choice: await rolesList()
  }
  ]).then((answers)=>{
    pool.query(`update employee set role_id = $3 where first_name = $1 AND last_name = $2`, [getFirstName[answers.name], getLastName[answers.name], getRoleID[answers.role]], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated employee's role");
      }
    });
  });
};
exp.ViewAllRoles = async function(){
  pool.query(`select * from role`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows);
    }
  });
};
exp.AddRole = async function(){
  inquirer.prompt([
    {
      type:'input',
      message: "What is the name of the department?",
      name: 'title'
  }, {
    type:'input',
    message: "What is the salary of the role?",
    name: 'salary'
  }, {
    type:'choice',
    message: "Which department does the role belongs to?",
    name: 'department',
    choice: await departmentList()
  }
  ]).then((answers)=>{
    pool.query(`insert into role (title, salary, department) values ($1, $2, $3)`, [answers.title, Number(answers.salary), getDepartmentID[answers.department]], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Added ${answers.department} to the database`);
      }
    });
  });
};
exp.ViewAllDepartments = async function(){};
exp.AddDepartment = async function(){
  pool.query(`select * from department`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.rows);
    }
  });
};

export default exp;

