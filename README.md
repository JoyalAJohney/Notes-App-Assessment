
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



## Description

### Build with
* <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS Badge"> Used NestJS as the backend framework for building out the notes app
* <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres Badge"> Postgres as the choice of Relational Database
  

## Setting Up

Create a .env file from the env.sample file. Fill in the values based on your required configuration. A sample configuration is shared below
```bash
# Database configuration
POSTGRES_HOST=localhost 
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

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
