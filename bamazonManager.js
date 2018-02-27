require("dotenv").config(); // get mySQL credentials
var mysql = require("mysql");
var inquirer = require("inquirer");
var banner = require('simple-banner');
var request = require("request");
var Table = require('cli-table');


banner.set("The Incredible Pet Supplies Marketplace -- Manager's Tool", "Cobbled together by zrowe", 0);
// console.log("\nWaiting for Inventory Records........");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: "bamazon"
});

offerOptions();

function offerOptions() {
    inquirer
        .prompt([{
            type: "list",
            name: "choice",
            message: "What would you like to do??",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add new Product", "Quit"]
        }])

        .then(function(answer) {
            switch (answer.choice) {

                case "View Products for Sale":
                    getAllRecords();
                    break;
                case "View Low Inventory":
                    getLowRecords();
                    break;
                case "Add to Inventory":
                    updateInventory();
                    break;
                case "Add new Product":
                    addNewProduct();
                    break;
                case "Quit":
                    exit(0);
            }
        });
}

function getAllRecords() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        showProducts(res);
        offerOptions();
    });
}

function getLowRecords() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        showProducts(res);
        offerOptions();
    });
}


function showProducts(res) {

    var table = new Table({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Qty Avail'],
        colAligns: ['middle', 'left', 'left', 'right', 'middle'],
        style: { 'padding-left': 1, 'padding-right': 1 }
    });

    for (var i = 0; i < res.length; i++) {

        var arr = [
            res[i].item_id,
            res[i].product_name,
            res[i].department_name,
            res[i].price.toFixed(2),
            res[i].stock_quantity
        ];

        table.push(arr);
    }
    // list out all the products
    console.log(table.toString());
}


function updateInventory() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        askForUpdate(res);
    });
}

function askForUpdate(res) {
    inquirer
        .prompt([{
                name: "itemId",
                type: "input",
                message: "What is the ID of the item you would like to add to? [Quit with a Q]",
                validate: function(value) {

                    if (value === "Q") { exit(0) };

                    for (var i = 0; i < res.length; i++) {
                        if (res[i].item_id == value) { return true; }
                    }; // if not found, the whine to the user
                    var str = "Item " + value + " does not exist, try again";
                    return str;
                }
            },
            {
                name: "qty",
                type: "input",
                message: "How many would you like to add? [Quite with a Q]",
                validate: function(value, answer) {

                    if (value === "Q") { exit(0) };

                    if (value > 0 && value <= 999) { return true; };

                    var str = "Quantity of " + value + " is not acceptable, please try again";
                    return str;
                }
            }
        ])
        .then(function(answer) {

            // answer.itemId contains the item_id
            // answer.qty contains the qty desired

            var record = res.find(function(obj) { return obj.item_id == answer.itemId; });
            newQty = record.stock_quantity + answer.qty;

            connection.query(
                "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newQty
                    },
                    {
                        item_id: record.item_id
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log("\n\u0007You just added " +
                        answer.qty + " units to " + record.product_name + "\n");

                    setTimeout(offerOptions, 3000);
                }
            );

        });
}


function addNewProduct() {
    connection.query("SELECT product_name FROM products", function(err, res) {
        if (err) throw err;
        getDepartments(res);
    });
}


function getDepartments(arrProducts) {
    connection.query("SELECT department_name FROM departments", function(err, res) {
        if (err) throw err;
        AskForNewProduct(arrProducts, res);
    });
}

function AskForNewProduct(arrProducts, arrDepartments) {
    inquirer
        .prompt([{
                name: "product_name",
                type: "input",
                message: "What is the new product name? [Quit with a Q]",
                validate: function(value) {

                    if (value === "Q") { exit(0) };

                    var str = "'" + value + "' is already our inventory"
                    for (var i = 0; i < arrProducts.length; i++) {
                        if (arrProducts[i].product_name === value) { return str; }
                    };
                    if (value.length === 0) { return false } // if not found, the whine to the user
                    return true;
                }
            },
            {
                name: "department_name",
                type: "list",
                message: "Which Department does it belong to?",
                choices: function() {

                    var choiceArray = [];
                    for (var i = 0; i < arrDepartments.length; i++) {
                        choiceArray.push(arrDepartments[i].department_name);
                    }
                    choiceArray.push("Quit -- (if you want to start over)")
                    return choiceArray;
                }
            },
            {
                name: "price",
                type: "input",
                message: "How much does it cost? [Quit with a Q]",
                validate: function(value) {

                    if (value === "Q") { exit(0) };

                    if (value > 0 && value <= 999) { return true; };

                    var str = "Price of " + value + " is not acceptable, please try again";
                    return str;
                }
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "How many do we have? [Quit with a Q]",
                validate: function(value) {

                    if (value === "Q") { exit(0) };
                    if (value > 0 && value <= 999) { return true; };

                    var str = "Quantity of " + value + " is not acceptable, please try again";
                    return str;
                }
            }
        ])
        .then(function(answer) {

            connection.query("INSERT INTO products SET ?", answer,
                function(err, res) {
                    if (err) throw err;
                    console.log("\n\u0007You just added qty " +
                        answer.stock_quantity + " " +
                        answer.product_name + " at $" +
                        (answer.price * 1).toFixed(2) + "each to Department " +
                        answer.department_name + "\n");
                    // restart the loop
                    setTimeout(offerOptions, 3000);
                }
            );

        });
}

// called when the manager wants to leave
function exit(exitCode) {
    connection.end();
    console.log("\n\nOur work is done here.");
    process.exit(exitCode)
}