-- Seed file for products and departments table for testing

USE bamazon;

-- Create departments first because products depends upon it

INSERT INTO departments (department_name, over_head_costs)
VALUES 
("Cat Stuff", 1000),
("Dog Stuff", 800),
("Bird Stuff", 200);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Arm & Hammer Multi-Cat Clump & Seal Clumping Litter", "Cat Stuff", 24.99, 25),
("PetSafe ScoopFree Ultra Self-Cleaning Cat Litter Box", "Cat Stuff", 159.95, 4),
("PEDIGREE Dentastix Large Dog Treats", "Dog Stuff", 13.99, 30),
("Petrodex Enzymatic Toothpaste Dog Poultry Flavor, 6.2 oz", "Dog Stuff", 7.30, 10),
("Taste of the Wild Grain Free High Protein Natural Dry Dog Food", "Dog Stuff", 53.99, 8),
("Advantage II Flea prevention for Small Cats", "Cat Stuff", 79.99, 5),
("Duckworth Large Dog Toy 13-inch Assorted Colors", "Dog Stuff", 15.99, 3),
("Milk-Bone Flavor Snacks Dog Treats", "Dog Stuff", 12.50, 8),
("Wesco Pet Kabob Shreddable Bird Toy", "Bird Stuff", 7.30, 20),
("Graham's Parrot Toy Creation Fiesta Bird Toy", "Bird Stuff", 9.99, 5),
("Real Rabbit Fur Mice Cat Toys 6-pack", "Cat Stuff", 9.95, 10),
("Dat Darn Ferret Rabbit Fur Cat Toy", "Cat Stuff", 7.99, 8);
