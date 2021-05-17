# Todo App - Backend

## Functionalities

* **User**
    1. Register User.
    2. Login.
    3. Renew Token.

* **Project**
    1. Get All User Projects.
    2. Get Project by ID.
    3. Get all Project Tasks.
    4. Create Project.
    5. Update Project.
    6. Delete Project.

* **Task**
    1. Get Task by ID.
    2. Create Task.
    3. Update Task.
    4. Delete Task.
    5. Set Task as Finished.
    5. Set Task as Unfinished.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

 * NODE 10 +
 * npm
 * A MySQl database

### Installing

Create a `.env` file at the root folder for local development or a `test.env` file at `__test__/_setup/` for testing.

**Environment variables**

* SV_PORT - Port to bind the server.
    * To integrate with [Todo App - Frontend](https://github.com/LFabre/todo-app-frontend) set it as `3001`.
* DB_HOST - Database host ip.
* DB_USER - Database user.
* DB_PSWD - Database user password.
* DB_PORT - Database port.
* DB_NAME - Database name.
* DB_DIALECT=mysql
* AUTH_JWT_SECRET - Secret to sign JWTs.
* AUTH_JWT_EXP_MIN - JWT expiration time, in minutes.

**Test - Environment variables**

Special environment variables for running test cases.

* TEARDOWN=TRUE
    * Set it as `TRUE` to run multiple test files.
    * Set it as `FALSE` to preserve database state after tests.
* DB_NAME
    * On test environments the database name must include the word **test**.
* DB_HOST
    * On test environments the database name must include the word **localhost**.

Install dependencies.

```
npm install
```

Run in development mode with nodemon.

```
npm run dev
```

Run with node.

```
npm start
```

Run test cases.

```
npm run test
```

### Easy database setup

To facilitate the creation of a test database a `docker-compose.yml` file containing a mysql service is provided at the `docker` folder. To use it set the environment variables as follow:

````
DB_HOST=localhost
DB_USER=root
DB_PSWD=root
DB_PORT=3306
DB_NAME=test
DB_DIALECT=mysql
TEARDOWN=TRUE
````
Start the service by running `docker-compose up` inside the `docker` folder.

## Author

* **Lucas Fabre** - [LFabre](https://github.com/LFabre)
