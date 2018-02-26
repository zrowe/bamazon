# bamazon

A Node.js &amp; MySQL based Marketplace

## Getting Started

To use, just clone down the repo, install the NPM modules, add your keys, and have fun.

### Prerequisites

LIRI BOT was built and tested with the following nodeJS NPM packages:

| NPM Package     | Version |
| --------------- | ------- |
| dotenv          | 5.0.0   |
| cli-table       | 0.3.1   |
| simple-banner   | 1.0.7   |
| inquirer        | 5.1.0   |
| mysql           | 2.15.0  |


You will need to install mySql (preferably V5.8 or later.YOu wiill want toi set a password.


### Installing

1. Clone the repo to your system.

1. Run `npm install`

1. Create a file named `.env`, add the following to it, replacing the values with your MySQL credentials (no quotes)  This will prevent you from inadvertently loading your credentialinto thr reop:

```js
# SQL Credentials

SQL_USER=root
SQL_PASSWORD=zyxxyplugh

```


### Usage