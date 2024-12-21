import inquirer from "inquirer";
import pg from 'pg';
import dotenv from 'dotenv';

//setup env
dotenv.config();
//setup object for exporting
const exp = {};

//setup pool from pg and database
const { Pool } = pg;
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
  await pool.query(`select * from role`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      getRoleID = {};
      const list = [];
      for (const row of result.rows) {
        getDepartmentID[row.title] = row.id;
        list.push(row.title);
      }
      return list;
    }
  });
}
async function managerList() {
  await pool.query(`select * from employee`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      getManagerID = {};
      const list = [];
      for (const row of result.rows) {
        getManagerID[`${row.first_name} ${row.last_name}`] = row.id;
        list.push(`${row.first_name} ${row.last_name}`);
      }
      return list;
    }
  });
}
async function employeeList() {
  await pool.query(`select * from employee`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      getFirstName = {};
      getLastName = {};
      const list = [];
      for (const row of result.rows) {
        getFirstName[`${row.first_name} ${row.last_name}`] = row.first_name;
        getLastName[`${row.first_name} ${row.last_name}`] = row.last_name;
        list.push(`${row.first_name} ${row.last_name}`);
      }
      return list;
    }
  });
}
async function departmentList() {
  await pool.query(`select * from department`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      getDepartmentID = {};
      const list = [];
      for (const row of result.rows) {
        getDepartmentID[row.name] = row.id;
        list.push(row.name);
      }
      return list;
    }
  });
}
//IMPORTANT NOTE: the functions break normal naming convention because it makes it easy to call them from object by inputing them into object and calling that function.
//functions for questionFunctions module
exp.ViewAllEmployees = async function (next) {
  await pool.query(`select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id as manager from employee join role on employee.role_id = role.id join department on role.department_id = department.id`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log();
      console.table(result.rows);
    }
    next();
  });
};
exp.AddEmployee = async function (next) {
  inquirer.prompt([
    {
      type: 'input',
      message: "What is the employee's first name?",
      name: 'firstName'
    }, {
      type: 'input',
      message: "What is the employee's last name?",
      name: 'lastName'
    }, {
      type: 'list',
      message: "What is the employee's role",
      name: 'role',
      choices: await rolesList()
    }, {
      type: 'list',
      message: "Who is the employee's manager",
      name: 'manager',
      choices: await managerList()
    }
  ]).then((answers) => {
    pool.query(`insert into employee (first_name, last_name, role_id, manager_id) values ($1, $2, $3, $4)`, [answers.firstName, answers.lastName, getRoleID[answers.role], getManagerID[answers.manager]], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Added ${answers.firstName} ${answers.lastName} to the database`);
      }
      next();
    });
  });
};
exp.UpdateEmployeeRole = async function (next) {
  inquirer.prompt([
    {
      type: 'list',
      message: "Which employee role are you updating",
      name: 'name',
      choices: await employeeList()
    }, {
      type: 'list',
      message: "Which role do you want to assign the employee",
      name: 'role',
      choices: await rolesList()
    }
  ]).then((answers) => {
    pool.query(`update employee set role_id = $3 where first_name = $1 AND last_name = $2`, [getFirstName[answers.name], getLastName[answers.name], getRoleID[answers.role]], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated employee's role");
      }
      next();
    });
  });
};
exp.ViewAllRoles = async function (next) {
  await pool.query(`select * from role`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log();
      console.table(result.rows);
    }
    next();
  });
};
exp.AddRole = async function (next) {
  inquirer.prompt([
    {
      type: 'input',
      message: "What is the name of the role?",
      name: 'title'
    }, {
      type: 'input',
      message: "What is the salary of the role?",
      name: 'salary'
    }, {
      type: 'list',
      message: "Which department does the role belongs to?",
      name: 'department',
      choices: await departmentList()
    }
  ]).then((answers) => {
    pool.query(`insert into role (title, salary, department) values ($1, $2, $3)`, [answers.title, Number(answers.salary), getDepartmentID[answers.department]], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Added ${answers.department} to the database`);
      }
      next();
    });
  });
};
exp.ViewAllDepartments = async function (next) {
  await pool.query(`select * from department`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log();
      console.table(result.rows);

    }
    next();
  });
};
exp.AddDepartment = async function (next) {
  inquirer.prompt([
    {
      type: 'input',
      message: "What is the name of the department?",
      name: 'name'
    }
  ]).then((answers) => {
    pool.query(`insert into department (name) values ($1)`, [answers.name], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Added ${answers.department} to the database`);
      }
      next();
    });
  });
};

export default exp;

