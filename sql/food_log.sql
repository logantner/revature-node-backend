create table food_log (
	id serial primary key,
	user_id varchar(30) references auth(id),
	log_date date,
	food_id int references food(id),
	quantity float check (quantity > 0),
	unit varchar(10) references food_unit(symbol)
);