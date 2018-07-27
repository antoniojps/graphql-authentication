# GraphQL Authentication with JWT

Learning project to implement an OAuth 2.0 (Google & Discord) and OpenID (Steam) authentication with Passport & GraphQL with Apollo V2 over json web tokens.
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Node v10.4.1 or above
* Mongo database
* Google+ API Setup
* Discord Application Setup
* Steam Api Key

### Installing

Clone

```
git clone https://github.com/antoniojps/graphql-authentication.git
```

Install dependencies

```
cd graphql-authentication
npm i
```

Setup the config in /src/setup/config/config.example.json:
* Rename the file to 'config.json'
* Add your variables

```
/src/setup/config/config.json
```

Run in the development environment

```
npm run dev
```

To test if the authentication is working open any of the following routes:
* Google - /auth/google
* Discord - /auth/discord
* Steam - /auth/steam

They should redirect you to the callback with the user data and token; A cookie is now set with the token

## Running the tests

If the above is done correctly running the tests should be as simple as:

```
npm run test
```

Make sure to the test variables in the config file /src/setup/config/config.json are setup correctly

### Running coding style tests

To clean up the code with eslint run

```
npm run eslint
```

## Deployment

Make sure you setup the production variables in the platform of your choise, the config.json file only defines variables for the 'development' and 'test' environments.

You need to change the callback routes to redirect to your client in /setup/routes/auth.js

```
// Replace this
// res.send(resSchema(req.user, res.statusCode))

// With
res.redirect(process.env.CLIENT_ORIGIN)
```

Delete the

Build the project with
```
npm run build
```

Start the production server
```
npm start
```

## Built With
* [Express](https://rometools.github.io/rome/) - Node.js web application framework
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - GraphQL API
* [Passport](http://www.passportjs.org/) - OAuth 2.0 and OpenID Flow
* [JWT](https://github.com/auth0/express-jwt) - Middleware that validates JsonWebToken

## Authors

* **António Santos** - [antoniosantos.me](https://antoniosantos.me)

## Acknowledgments

* Thank you [Akryum](https://github.com/Akryum) for this [awesome project](https://github.com/Akryum/vue-summit-app) where I learned most from
