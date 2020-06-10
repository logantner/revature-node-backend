# Nutritional Logger API

## Introduction

The nutritional logger API is defined with respect to RESTful practices. The 
interface supports standard HTTP requests with information embedded in GET 
parameters and POST bodies, with responses in JSON form and making use of
standard HTTP status codes. Responses will contain informative messages upon the
success or failure in processing a request, when applicable. 

At the present time, the nutritional archive is a
read-only database, and primary interactions will occur between users and the
food logging database. This project is currently in active development as we
expand available features.

## Authentication

Logging credentials consist of a single username and password, from a unified 
point of entry. The user role is determined at verification, and sessions are
maintained through the storage of an encrypted authentification cookie. Cookies
do not expire in a time-sensitive fashion, and will be cleared once the client
has submited a signout request.

### Registering a New Account:

* Method: POST
* URI: /auth/register
* Data fields are submitted in JSON format within the body of the request
* Required fields:
    * **username**: A string that must be distinct from those already registered
    * **password**: A string with any desired properties

### Logging In:

Once logged in successfully, a session will begin and persist until the user
logs out or closes their browser.

* Method: POST
* URI: /auth/login
* Data fields are submitted in JSON format within the body of the request
* Required fields:
    * **username**
    * **password**

### Logging Out:

Once logged in successfully, a session will begin and persist until the user
logs out or closes their browser.

* Method: GET
* URI: /auth/logout
* Required fields: None

### Delete Account:

At the present time, only accounts with admin privileges have the ability to
delete accounts, and only non-admin accounts may be deleted through the API.
Upon the deletion of an account, all nutritional logs associated with the 
account will be removed.

* Method: DEL
* URI: /auth/delete
* Data fields are submitted in JSON format within the body of the request
* Required fields:
    * **user**: The username associated with a registered account

## The Nutritional Database

The nutritional data is at the heart of the logging system, featuring detailed
and accurate values collected by the FDA's 
[FoodData Central](https://www.example.com/my%20great%20page) resource. Each
entry consists of the following elements:

* id: An integer reference
* name: A short description of the food, not intended as an identifier
* quantity: An amount to accompany the unit
* unit: A standard measurement abreviation
* category: A general nutritional category
* brand: The branding company, if applicable
* calories: Calories
* total_fat_g: Total fat, in grams
* cholesterol_mg: Cholesterol, in milligrams
* carbohydrates_g: Carbohydrates, in grams
* protein_g: Protein, in grams
* sugars_g: Total sugars, in gvams
* sodium_mg: Sodium, in milligrams
* vit_a_ug: Vitamin A, in micrograms
* vit_c_mg: Vitamin C, in milligrams
* calcium_mg: Calcium, in milligrams

## The Nutritional Logger

## Admin Requests

## Upcoming Features

