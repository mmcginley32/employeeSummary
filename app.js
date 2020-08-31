const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// initialize empty team
const team = [];

// initial questions that all employees must answer 
// memberType is the type of emplyoee being created (manager, engineer, or intern)
const initPrompt = (memberType) => {
    return [
        {
            type: "input",
            name: "name",
            message: `What is the ${memberType}'s name?`
        },{
            type: "input",
            name: "id",
            message: `What is the ${memberType}'s id?`
        },{
            type: "input",
            name: "email",
            message: `What is the ${memberType}'s email?`,
            validate: ans => {
                const emailCheck = ans.match(/\S+@\S+.\S{3}/) //make sure a proper email is entered
                if (emailCheck) {
                    return true;
                }
                return "Please enter a correct email.";
            }
        }]
}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// get info for the manager of the team and add the manager to the team
const createManager = async () => {
    //using await syntax
    const answers = await inquirer.prompt ([
        ...initPrompt("manager"), //insert initial questions for manager
        {
            type: "input",
            name: "officeNumber",
            message: "What is the manager's office number?",
        }
    ])
    
    const { name, id, email, officeNumber } = answers;
    team.push(new Manager(name, id, email, officeNumber));
    
    // ask about adding more employees to the team
    createTeam();
}

// add more employees to the team or quit
const createTeam = () => {
    // using promise syntax just to use it
    inquirer.prompt ([
        {
            type: "list",
            message: "Would you like to add another teammate",
            name: "another",
            choices: ["Engineer","Intern","All done"]
        }
    ]).then(({ another }) => {
        // console.log('another: ', another);
        
        switch(another) {
            case 'Engineer':
                createEngineer();
                break;
            case 'Intern':
                createIntern();
                break;
            default:
                buildTeam();
                break;
        }
    })
}

const createEngineer = async () => {
    // console.log("starting engineer");

    const answers = await inquirer.prompt ([
        ...initPrompt("engineer"),
        {
            type: "input",
            name: "github",
            message: "What is the engineer's github username?"
        }
    ])

    const { name, id, email, github } = answers;
    team.push(new Engineer(name, id, email, github));

    // ask about adding more employees to the team
    createTeam();
}

const createIntern = async () => {
    // console.log("starting intern");

    const answers = await inquirer.prompt ([
        ...initPrompt("intern"),
        {
            type: "input",
            name: "school",
            message: "What school is the intern attending?"
        }
    ])

    const { name, id, email, school } = answers;
    team.push(new Intern(name, id, email, school));

    // ask about adding more employees to the team
    createTeam();
}

const buildTeam = () => {
    // const html = render(team);

    // if (!fs.existsSync(OUTPUT_DIR)) {
    //     fs.mkdirSync(OUTPUT_DIR);
    // }
    // fs.writeFile(outputPath, html);
}

// start with manager
createManager();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
