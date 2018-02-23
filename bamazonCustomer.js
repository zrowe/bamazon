require("dotenv").config(); // get mySQL credentials
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: "bamazon"
});

connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
    if (err) throw err;
    connection.end();
    showProducts(res);
});

function showProducts(res) {

    var table = new Table({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Qty Avail'],
        colAligns: ['middle', 'left', 'left', 'right', 'middle'],
        // colWidths: [5, 80, 25, 10, 10],
        // chars: {
        //     'top': '═',
        //     'top-mid': '╤',
        //     'top-left': '╔',
        //     'top-right': '╗',
        //     'bottom': '',
        //     'bottom-mid': '',
        //     'bottom-left': '',
        //     'bottom-right': '',
        //     'left': '',
        //     'left-mid': '',
        //     'mid': '',
        //     'mid-mid': '',
        //     'right': '',
        //     'right-mid': '',
        //     'middle': ' '
        // },
        style: { 'padding-left': 1, 'padding-right': 1 }
    });


    for (var i = 0; i < res.length; i++) {
        var arr = Object.keys(res[i]).map(function(key) { return res[i][key]; });
        table.push(arr);
    }
    // list out all the products
    console.log(table.toString());
    askForPurchase();
}

function askForPurchase() {

    // "What is the ID of the item you would like to purchase? [Quit with a Q]"
    // get id 
    // if Q then quit
    // "How many would you like? [Quite with a Q]"

}