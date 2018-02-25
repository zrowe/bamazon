require("dotenv").config(); // get mySQL credentials
var mysql = require("mysql");
var inquirer = require("inquirer");
var banner = require('simple-banner');
var request = require("request");
var Table = require('cli-table');


banner.set("The Incredible Pet Supplies Marketplace", "Cobbled together by zrowe", 0);
console.log("\nWaiting for Inventory Records........");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: "bamazon"
});

// Let's Rock an roll......
getProductRecords();

function getProductRecords() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        showProducts(res);
        askForPurchase(res)
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

function askForPurchase(res) {
    inquirer
        .prompt([{
                name: "itemId",
                type: "input",
                message: "What is the ID of the item you would like to purchase? [Quit with a Q]",
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
                message: "How many would you like? [Quite with a Q]",
                validate: function(value, answer) {

                    if (value === "Q") { exit(0) };

                    var record = res.find(function(obj) { return obj.item_id == answer.itemId; });
                    if (value > 0 && value <= record.stock_quantity) { return true; };

                    var str = "Quantity (" + value + ") is not available, please try again";
                    return str;
                }
            }
        ])
        .then(function(answer) {

            // answer.itemId contains the item_id
            // answer.qty contains the qty desired

            var record = res.find(function(obj) { return obj.item_id == answer.itemId; });
            newQty = record.stock_quantity - answer.qty;

            var query = connection.query(
                "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newQty
                    },
                    {
                        item_id: record.item_id
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log("\n\u0007You just purchased " + 
                    answer.qty + " " + record.product_name + " for $" +
                    (answer.qty * record.price).toFixed(2) + "\n");
                    // console.log(res.affectedRows + " products updated!\n");
                    // restart the loop
                    setTimeout(getProductRecords, 3000);
                    // getProductRecords(); // restart the order syscl
                }
            );

        });
}

// called when the shopper wants to leave
function exit(exitCode) {
    connection.end();
    console.log("\n\nThank you for shopping with us.");
    process.exit(exitCode)
}