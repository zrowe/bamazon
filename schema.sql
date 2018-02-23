DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT UNIQUE KEY,
  department_name VARCHAR(25) NOT NULL PRIMARY KEY,
  over_head_costs DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(80) NOT NULL,
  product_sales INT NOT NULL DEFAULT 0,
  department_name VARCHAR(25) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity SMALLINT NOT NULL DEFAULT 0,
  FOREIGN KEY (department_name) REFERENCES departments(department_name)
);