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

## The Nutritional Database

The nutritional data is at the heart of the logging system, featuring detailed
and accurate values collected by the FDA's 
[FoodData Central](https://fdc.nal.usda.gov/fdc-app.html/) resource. This data 
is public, and does not require authentication to view. Each entry consists of 
the following elements:

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

### Searching the Nutritional Table:

* Method: GET
* URI: /search
* Data fields are submitted as GET parameters
* Required fields: None
* Optional fields:
    * **cat**: A food category. Specifying this value will limit the search result to foods exclusively within this category. The following categories are supported:
        * dairy
        * grain
        * meat
        * processed
        * produce
        * beverage
    * **sortby**: A nutritional column to sort the data in descending order. The following case-sensitive keywords are supported:
        * name
        * calories
        * fat
        * cholesterol
        * protein
        * carbohydrates
        * sugars
        * sodium
        * vitaminA
        * vitaminC
        * calcium
    * **limit**: The maximum number of entries to return. Only positive integer representations of this field are supported.

## The Nutritional Logger

Authenticated users have the option of storing a history of their food intake
within the nutrional log database. Such entries, which are private to all other
users, may be updated and viewed at any time. Each entry of the food database 
table consists of the following:

* id: An integer reference
* user_id: The name of the user posting the item
* log_date: A specified entry date
* food_id: The unique food identifier
* quantity: A positive amount
* unit: A supported unit of measurement

### Reading the Logger:

An authenticated user may, at any time, review their food log history (displayed
in chronological order from most recent).

* Method: GET
* URI: /log
* Required fields: None

### Adding to the Logger:

An authenticated user may also add food items to their log on a valid day, and
using a supported unit of measurement.

* Method: PUT
* URI: /log
* Data fields are submitted in JSON format within the body of the request
* Required fields:
    * **date**: A date (string) at or prior to the present, in the form MM/DD/YYYY
    * **food_id**: One of the available food identifiers within the nutrition database. Any values not matching an existing food will be rejected.
    * **quantity**: A positive numerical amount
    * **unit**: One of the following supported shortened unit symbols:
        * g: grams
        * cup: cups
        * tbsp: tablespoons
        * mL: millileters
        * fl_oz: fluid ounces
        * oz: dry ounces

## Admin-Specific Requests

A few actions are restricted to those with administrator privileges.

### Deleting an Account:

At the present time, only accounts with admin privileges have the ability to
delete accounts, and only non-admin accounts may be deleted through the API.
Upon the deletion of an account, all nutritional logs associated with the 
account will be removed.

* Method: DEL
* URI: /auth/delete
* Data fields are submitted in JSON format within the body of the request
* Required fields:
    * **user**: The username associated with a registered account

### Promoting Users:

An administrator has the option of promoting a standard user account to 
adminstrator status. This action currently cannot be undone by use of the API.

* Method: POST
* URI: /auth/Promote
* Data fields are submitted in JSON format within the body of the request
* Required fields:
    * **user**: The username associated with a registered account

## Upcoming Features

The following are intended to be added in the (near) future:
* Nutritional log searches that specify a date range
* Nutritional summaries for specified dates or date ranges
* A front end UI
