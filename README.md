# NC-News

## Project demonstrating good practice for backend development in Node.js by Matthew C Wake

# Hosting

A live version of this project is hosted on Heroku at [https://mcw-nc-news.herokuapp.com/api](https://mcw-nc-news.herokuapp.com/api)

# Summary

This project is the capstone on the Backend module of the Northcoders Web Development Bootcamp. It has been implemented by me (Matthew C Wake) following a specification provided by Northcoders.

## Skills Demonstrated

- General Node.js usage
- Promises and Async/Await
- TDD using Jest and Supertest
- Environment management with seeding and dotenv
- Express routing, middleware and error-handling
- MVC architecture
- Interacting with a PostgreSQL database
- REST API
- CI/CD using Github Actions

# Setup

## Software

### Node.js

This API requires Node.js version 16.13.0+ - while other versions may work they have not been tested with this API. It is recommended for development purposes to install Node.js using [nvm](https://github.com/nvm-sh/nvm) as this allows for multiple versions of Node.js to exist simulatenously on the same system, and avoids permissions issues with certain NPM packages.

### PostgreSQL

This API requires an installation of PostgreSQL version 13+ for data storage and retrieval. On Ubuntu you can install PostgreSQL with the following command:

```
    sudo apt install postgresql
```

Once installed, enable autostart of the database with the following command:

```
    sudo systemctl enable postgresql
```

For ease of development, it is recommended to follow the instructions [here](https://www.postgresql.org/docs/9.3/libpq-pgpass.html) to create a .pgpass file which facilitates automatic login for the current user.

## Clone Repository

This public repo can be cloned using the following command:

```
    git clone https://github.com/mcwake-dev/mcw-nc-news
```

## Install Dependencies

Dependencies can be installed using the following command in the project root once cloned.

```
    npm i
```

## Create .env files

### Development Environment

Create the following file in the root of the project:

```
    .env.development
```

In this file, add the following environment variable:

```
    PGDATABASE=nc_news
```

### Testing Environment

Create the following file in the root of the project:

```
    .env.test
```

In this file, add the following environment variable:

```
    PGDATABASE=nc_news_test
```

## Seeding Database

### Creating DBs

In order to test and develop with this API, development and test datasets have been supplied. To create the required databases, or to revert changes, use the following command in the project root folder:

```
    npm run setup-dbs
```

This command will destroy and recreate the dev and test databases.

### Populating Tables

Once the databases exist, you can use the following command to populate the new databases with data for testing purposes.

```
    npm run seed
```

## Testing

To run all tests and ensure correct operation of the API, use the following command:

```
    npm test
```

# CI/CD on Heroku

Should you wish to use the included Github Actions workflow to automate testing and deployment to Heroku, configure the following Secrets in your Settings on Github.com for your fork of this repository:

```
    HEROKU_API_KEY - Your api key from Heroku - you will need a Heroku account then this can be accessed from [https://dashboard.heroku.com/account](https://dashboard.heroku.com/account)
    HEROKU_APP_NAME - Your unique app name on Heroku
    HEROKU_EMAIL_ADDRESS - The email address associated with your Heroku account
```
