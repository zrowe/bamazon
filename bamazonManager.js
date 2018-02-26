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
            choices: ["View Products for Sale", "Add to Inventory", "Add new Product", "Quit"]
        }])

        .then(function(answer) {
            switch (answer.choice) {

                case "View Products for Sale":
                getProductRecords();
                offerOptions();
                    break;
                case "Add to Inventory":
                    break;
                case "Add new Product":
                    break;
                case "Quit":
                    exit(0);
            }
        });
}

function getProductRecords() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        showProducts(res);
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



// If a manager selects View Products
// for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will
// let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.


//     ?
//     WHat would you like to do ?

//         View Products
//     for
//     Sale
// Add to Inventory
// Add new Product
// Quit







// Add New Product:

//     WHat is the name of the product you would like to Add
// Which department does this fall Inventory
// How much does it cost
// How many do we have


// called when the manager wants to leave
function exit(exitCode) {
    connection.end();
    console.log("\n\nOur work is done here.");
    process.exit(exitCode)
}