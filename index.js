const inquirer = require("inquirer");
//const pg = require('pg');
const questionFunctions = require('./assets/modules/questionFunctions');

//Set Up
let run = true;//used to keep program running till they pick quit
//whatNext function ask users which choice they want to do and then runs that function based on there answer
async function whatNext(){
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
    ]).then(async (answers)=>{
        const answer = answers.myPick.split('').join();//removes spaces so that it can be used as function names
        if (answer == 'Quit'){
            run = false;//if you picked quit then it sets run to false
        } else {
            await questionFunctions[answer]();//will run code for what ever choice you picked
        }
    })
}
//start function starts program
(async function start() {
    await questionFunctions.connectToDb();
    while(run){
        await whatNext();
    }
})();
