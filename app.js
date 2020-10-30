const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const logo = require('asciiart-logo');
const config = require('./package.json');

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const generate = require("./lib/htmlRenderer");

// prompt user with questions about empoloyees
class TeamGenerator {

    constructor(){

        this.empolyees = [];
        this.questions = {
            init: [
                {
                    type: 'list',
                    name: 'memberType',
                    message: 'Which type of employee do you want to add?',
                    choices: ["Manager", "Engineer", "Intern", "NOT RIGHT NOW"]
                }
            ],
            employee: [
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter Employee name'
                },
                {
                    type: 'input',
                    name: 'id',
                    message: ' Enter Employee ID'
                },
                {
                    type: 'input',
                    name: 'email',
                    message: "Enter the Employee's email"
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Please, select the employee's role",
                    choices: ["Manager", "Engineer", "Intern"]
                }
            ],
            manager: [
                {
                    type: 'input',
                    name: 'officeNumber',
                    message: "What is the manager's office Number?"
                }
            ],
            engineer: [
                {
                    type: 'input',
                    name: 'github',
                    message: "What is the Employee's github user name?"
                }
            ],
            intern: [
                {
                    type: 'input',
                    name: 'school',
                    message: "Enter the interns' School"
                }
            ]

        };
        

    }
    // starts the application
    runApp(){
        // display  ASCII logo of the Application
        console.log(
            logo({
               name: 'Purple Team Generator',
               font: 'Big Money-ne',
               linechars: 10,
               padding: 2,
               margin: 3,
               borderColor: 'cyan',
               logoColor: 'bold-magenta',
               textColor: 'bold-green',
            })
            .emptyLine()
            .right('version 1.0')
            .emptyLine()
            .center('Create Teams Fast and Easy')
            .render()
        );

        // ask general questions to all employees
        this.promptQuestions(this.questions.init);

    }

    // prompt user with employee questions
    promptQuestions(questions) {
        inquirer.prompt(questions)
        .then(res => {

            const { memberType, name, id, email, officeNumber, github, school, role } = res;

            if(role){
                this.addTeamMembers({name, id, email, officeNumber, github, school, role });
            }

            const newQuestion = [];

                if (memberType == "Manager") {
                    this.questions.manager.map(q => newQuestion.push(q));
                } else if (memberType === "Engineer") {
                    this.questions.engineer.map(q => newQuestion.push(q));
                } else if (memberType === "Intern") {
                    this.questions.intern.map(q => newQuestion.push(q));
                } else {
                    if(this.empolyees){
                        this.generate();
                    }
                    return;
                    console.log('Team member has been added to employees');
                }

            // Ask role specific employee questions
            this.questions.employee.reverse().map(q => newQuestion.unshift(q));
            newQuestion.push(this.questions.init[0]);

            this.promptQuestions(newQuestion);

        })
        .catch(err => {
            console.log(err);
        });
    }

    nextQuestions(){ 
    }

    // Create employee with role
    addTeamMembers(employee){
        
        let member;
        if (employee.role === "Manager") {
            member = new Manager(employee.name, employee.id, employee.email, employee.officeNumber);
        } else if(employee.role === "Engineer"){
            member = new Engineer(employee.name, employee.id, employee.email, employee.github);
        } else {
            member = new Intern(employee.name, employee.id, employee.email, employee.school);
        }
        this.empolyees.push(member);
        console.log('New Team Member Added')
    }
    // Create html page with team members 
    generate(){ 
        const html = generate(this.empolyees);
        fs.writeFileSync("index.html", html);
        console.log('Team Created')
    }
    // exit the program
    exit(){
        process.exit(0);
    }

}
const team = new TeamGenerator();
team.runApp();
