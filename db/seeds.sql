INSERT INTO department (department_name)
VALUES ("HR"),
("Customer Service"),
("Accounting"),
("Engineering"),
("Logistics"),
("Insurance/Legal");

INSERT INTO roles (role_title, role_salary, department_id)
VALUES ("Assistant", 70000, 1),
("Technical Supervisor", 80000, 4),
("Lead Engineer", 80000, 4),
("Accountant", 75000, 3),
("Receptionist", 35000, 2),
("HR Manager", 106000, 1),
("Truck Driver", 70000, 5),
("Shipping Supervisor", 76000, 5),
("Corporate Lawyer", 95000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Wazowski", 6, NULL),
("Doug", "Judy", 7, 1);