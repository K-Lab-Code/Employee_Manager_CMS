import inquirer from 'inquirer';
//const pg = require('pg');
import questionFunctions from './assets/modules/questionFunctions.js';

//Set Up
//whatNext function ask users which choice they want to do and then runs that function based on there answer
function whatNext(){
    inquirer.prompt([
        {
            type:'list',
            message: 'What would you like to do?',
            name: 'myPick',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ]
        }
    ]).then((answers)=>{
        const answer = answers.myPick.split(' ').join('');//removes spaces so that it can be used as function names
        if (answer == 'Quit'){
            process.exit(1);
        } else {
            console.log(answer);
            questionFunctions[answer](whatNext);//will run code for what ever choice you picked
            
        }
    });
}


//start function starts program
await questionFunctions.connectToDb();
whatNext();

