create table role (
	id serial primary key,
	description varchar(30)
);

insert into role (description) values ('admin');
insert into role (description) values ('user');

create table auth (
	id varchar(30) primary key,
	password varchar(30) not null,
	role_id integer references role(id)
);

create table food_unit (
	symbol varchar(10) primary key,
	fullname varchar(30)
);

insert into food_unit values ('g', 'grams');
insert into food_unit values ('cup', 'cups');
insert into food_unit values ('tbsp', 'tablespoons');
insert into food_unit values ('mL', 'millileters');
insert into food_unit values ('fl_oz', 'fluid ounces');
insert into food_unit values ('oz', 'ounces');

create table food_category (
	name varchar(30) primary key
);

insert into food_category values ('dairy');
insert into food_category values ('grain');
insert into food_category values ('meat');
insert into food_category values ('processed');
insert into food_category values ('produce');
insert into food_category values ('beverage');

create table food (
	id serial primary key,
	name varchar(100) not null, 
	quantity float check (quantity > 0), 
	unit varchar(10) references food_unit(symbol), 
	category varchar(30) references food_category(name), 
	brand varchar(100), 
	calories int check (calories >= 0), 
	total_fat_g float check (total_fat_g >= 0), 
	cholesterol_mg int check (cholesterol_mg >= 0), 
	carbohydrates_g float check (carbohydrates_g >= 0), 
	protein_g float check (protein_g >= 0), 
	sugars_g float check (sugars_g >= 0), 
	sodium_mg float check (sodium_mg >= 0), 
	vit_a_ug int check (vit_a_ug >= 0), 
	vit_c_mg int check (vit_c_mg >= 0), 
	calcium_mg int check (calcium_mg >= 0)
);

create table food_log (
	id serial primary key,
	user_id varchar(30) references auth(id),
	log_date date,
	food_id integer references food(id), 
	quantity float check (quantity > 0), 
	unit varchar(10) references food_unit(symbol)
);