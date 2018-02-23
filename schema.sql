DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(80) NOT NULL,
  product_sales INT NOT NULL DEFAULT 0,
  department_name VARCHAR(80) NOT NULL,
  price DECIMAL(M,2) NOT NULL DEFAULT 0,
  stock_quantity SMALLINT NOT NULL DEFAULT 0
);


CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs DECIMAL(M,2) NOT NULL DEFAULT 0
);
