const db = require("./server/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Provides user with a selection of tasks
const actionChoice = async () => {
    const userMenu = await inquirer.prompt({
        type: "list",
        name: "chooseAction",
        message: "Choose a starting point.",
        choices: [
            "View departments",
            "View roles",
            "View employees",
            "View employees by manager",
            "Add department",
            "Add role",
            "Add employee",
            "Update employee's role",
            "Update employee's manager",
            "Quit"
        ]
    });
    console.log("Use the UP or DOWN arrow to continue");
    return userMenu.chooseAction;
};

// Shows the corresponding table based on user selection
const viewAllChoices = (userChoice) => {
    if (userChoice === "View employees"){
        var sql = "SELECT * FROM employee";
    } if (userChoice === "View roles"){
        var sql = "SELECT * FROM roles";
    } if (userChoice === "View departments"){
        var sql = "SELECT * FROM department";
    }
    db.query(sql, (err, rows) => {
        if (err) {
            console.err(err);
            actionChoice();
        } else {
            console.log("\n");
            console.table(rows);
        }
    });
}

//adds new department to table
const addDepartment = async () => {
    const departmentInfo = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "Enter a department name."
    });
    const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
    //passes new department name to query
    const params = [departmentInfo.departmentName]
    db.query(sql, params, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`${departmentInfo.departmentName} successfully added to the department table`);
        }
    })
}


const addRole = async () => {
    const roleInfo = await inquirer.prompt([
        {
            type: "input",
            name: "roleName",
            message: "Enter an employee role."
        },
        {
            type: "number",
            name: "salary",
            message: "Enter a salaray figure."
        },
        {
            type: "number",
            name: "departmentId",
            // could be updated
            message: "Enter the departmentId for this role."
        }
    ]);
    const sql = `INSERT INTO roles (role_title, role_salary, department_id)
    VALUES (?,?,?)`;
    const params = [
        roleInfo.roleName,
        roleInfo.salary,
        roleInfo.departmentId
    ];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.log("\n");
            console.table(tableOutput);
            console.log("Use the UP or DOWN arrow to continue");
        }
    });
};

const addEmployee = async () => {
    const employeeInfo = await inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Enter employee's first name."
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter employee's last name."
        },
        {
            type: "number",
            name: "employeeRoleID",
            message: "Enter employee's role id."
        },
        {
            type: "number",
            name: "employeeManagerID",
            message: "Enter the manager's id for this employee."
        }
    ]);
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`
    const params = [
        employeeInfo.firstName,
        employeeInfo.lastName,
        employeeInfo.employeeRoleID,
        employeeInfo.employeeManagerID
    ];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.log("\n");
            console.table(tableOutput);
            console.log("Use the UP or DOWN arrow to continue");
        }
    });
};

const viewManagerEmployees = async () => {
    //gathers data to select proper manager
    const employeeInfo = await inquirer.prompt({
        type: "number",
        name: "managerId",
        message: "Enter a manager id to see their employees"
    });
    //sets sql query to return manager employee list
    const sql = `SELECT * FROM employee WHERE manager_id=?`
    
    //passes user input to db query
    const params = [employeeInfo.managerId];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.log("\n");
            console.table(tableOutput);
            console.log("Use the UP or DOWN arrow to continue");
        }
    });
}

const updateEmployee = async () => {
    const employeeUpdated = await inquirer.prompt([
        {
            type: "number",
            name: "employeeID",
            message: "Enter a valid employee id."
        },
        {
            type: "number",
            name: "newRoleID",
            message: "Enter the employee's updated role id."
        }
    ]);
    const sql = `UPDATE employee SET role_id=? WHERE id=?`
    const params = [
        employeeUpdated.newRoleID,
        employeeUpdated.employeeID
    ];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.log("\n");
            console.table(tableOutput);
            console.log("Use the UP or DOWN arrow to continue");
        }
    });
};

const updateEmployeeManager = async () => {
    const employeeManagerUpdated = await inquirer.prompt([
        {
            type: "number",
            name: "currentEmployeeId",
            message: "Enter the id of the employee you wish to update."
        },
        {
            type: "number",
            name: "updatedManagerId",
            message: "Enter the id of their new manager."
        }
    ]);
    const sql = `UPDATE employee SET manager_id=? WHERE id=?`
    const params = [
        employeeManagerUpdated.updatedManagerId,
        employeeManagerUpdated.currentEmployeeId
    ];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.log("\n");
            console.table(tableOutput);
            console.log("Use the UP or DOWN arrow to continue");
        }
    });
};

//starts program
const init = async () => {
    let exit = false;
    while (exit === false) {
        let choice = await actionChoice();
        if (choice === "Quit") {
            exit = true;
            return quit();
        } else if (
            choice === "View departments" ||
            choice === "View roles" ||
            choice === "View employees"
            ) {
            viewAllChoices(choice);
            //compares user choice and calls proper method accordingly
        } else if (choice === "View employees by manager") {
            let employeesByManager = await viewManagerEmployees();
        } else if (choice === "Add department") {
            let newDepartment = await addDepartment();
        } else if (choice === "Add role") {
            let newRole = await addRole();
        } else if (choice === "Add employee") {
            let newEmployee= await addEmployee();
        } else if (choice === "Update employee's role") {
            let updatedEmployee = await updateEmployee();
        } else if (choice === "Update employee's manager") {
            let updatedEmployeeManager = await updateEmployeeManager();
        }
    }
};

const quit = () => {
    process.exit();
};

init();