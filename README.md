
<div align="center">
  <a href="https://github.com/JoyalAJohney/Notes-App-Assessment/">
    <img src="https://raw.githubusercontent.com/othneildrew/Best-README-Template/master/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Notes-App Assessment</h3>

  <p align="center">
    Github repo containing source code for notes-app as a part of assessment
    <br />
    <a href="https://github.com/JoyalAJohney/Notes-App-Assessment/"><strong>Explore the docs »</strong></a>
    <br />
  </p>
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge">
  *
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS Badge">
  *
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres Badge">
</div>
  

## Setting Up

* Create a .env file from the env.sample file.
* Fill in the values based on your required configuration.
* Make sure that the .env file is in the same level as docker-compose.yml file
  
```bash
# Database configuration
POSTGRES_HOST=postgres 
POSTGRES_PORT=5432
POSTGRES_DB=notes_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# App configuration
APP_PORT=3000

# JWT configuration
JWT_SECRET=4c8a09f4b8f234b4e7b9f0b1c5e7c8b8

# Rate limit configuration
THROTTLE_LIMIT=5
THROTTLE_TTL=60000 # 1 minute
```

## Running the app

Execute the below command to build the postgres and the application containers
```bash
$ docker-compose up --build
```
If the application starts perfectly fine, you should be able to head over to http://localhost:APP_PORT/api/docs

## Test
Make sure you are running on node version 16 or above

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
