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
    askForPurchase(res)
});

function showProducts(res) {

    var table = new Table({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Qty Avail'],
        colAligns: ['middle', 'left', 'left', 'right', 'middle'],
        style: { 'padding-left': 1, 'padding-right': 1 }
    });

    for (var i = 0; i < res.length; i++) {
        var arr = Object.keys(res[i]).map(function(key) { return res[i][key]; });
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

                    if (value === "Q") { process.exit(0) };

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

                    if (value === "Q") { process.exit(0) };

                    var record = res.find(function(obj) { return obj.item_id == answer.itemId; });
                    if (value > 0 && value <= record.stock_quantity) { return true; };
                    // if not found, the whine to the user
                    var str = "Quantity (" + value + ") is not available, please try again";
                    return str;
                }
            }
        ])
        .then(function(answer) {

            // answer.item contains the item_id
            // answer.qty contains the qty desired

            // var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
            // connection.query(query, [answer.start, answer.end], function(err, res) {
            //   for (var i = 0; i < res.length; i++) {
            // console.log(
            //   "Position: " +
            //     res[i].position +
            //     " || Song: " +
            //     res[i].song +
            //     " || Artist: " +
            //     res[i].artist +
            //     " || Year: " +
            //     res[i].year
            // );
            // }
            // runSearch();
            // });
        });
}