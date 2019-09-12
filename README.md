## FREEMENTOR

[![Build Status](https://travis-ci.org/kakaprodo/freementor.svg?branch=develop)](https://travis-ci.org/kakaprodo/freementor) [![Coverage Status](https://coveralls.io/repos/github/kakaprodo/freementor/badge.svg?branch=develop)](https://coveralls.io/github/kakaprodo/freementor?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/5988e41bad95bc799899/maintainability)](https://codeclimate.com/github/kakaprodo/freementor/maintainability)

## Platform Description
A social platform where more experienced people  support and encourage less experienced people to manage their own learning so that they can maximise their potential,their development skills, improving their performance and become the person they want to be

## Features
- Users view the welcome page that expressively describes the platform.
- Users can sign up.
- Users can sign in.
- Admin can change a normal user to an admin.
- Admin can change an admin to normal user.
- Admins can change user to mentor.
- Admin can change a mentor to normal user.
- Users can view all mentors.
- Users can view a specific mentor.
- Users can create a mentorship session request.
- Mentor can accept a mentorship session request.
- Mentor can reject a mentorship session request.
- Mentor can view all mentorship sessions request created against him.
- Mentee can view all mentorship sessions request created by him.
- User can create a review after a mentorship session.
- Admin can delete a mentorship review deemed inappropriate.

## User interface links
- For accessing the users side : [visite page here](https://kakaprodo.github.io/freementor/UI/)
- For accessing the admin side :[visite page here](https://kakaprodo.github.io/freementor/UI/html/admin/dashboard.html)

## API Endpoints Specifications

- Api Roots : freementors-app.herokuapp.com/api/v2

| Endpoint | Request | Status | Description |
| --- | --- | --- | --- |
| / | GET | 200 OK | Helps users to access to the root of the api |
| /auth/signup | POST | 201 OK | Makes a post request to register a new user and return token |
| /auth/signin | POST | 200 OK | Sign in an existing user and return token |
| /admin/:userId | PATCH | 200 OK | For the admin to change a normal user to admin |
| /admin-to/:adminId | PATCH | 200 OK | For the admin to change another admin to a normal user |
| /user/:userId | PATCH | 200 OK | For the admin to change user to mentor |
| /mentor/:mentorId | PATCH | 200 OK | For admin to change a mentor to normal user|
| /mentors | GET | 200 OK | For displaying the list of all mentors |
| /mentors/:mentorId | GET | 200 OK | For displaying a specific mentor |
| /sessions | POST | 200 OK | For users to create a mentorship session request |
| /sessions/:sessionId/accept | PATCH | 200 OK | For mentors to accept a mentorship session request |
| /sessions/:sessionId/reject | PATCH | 200 OK | For mentors to reject a mentorship session request |
| /sessions | GET | 200 OK | For users to view  mentorship session requests |
| /sessions/:sessionId/review | POST | 200 OK | For users to create a review after a mentorship session|
| /sessions/:sessionId/review | DELETE | 200 OK | For admin to delete a specific mentorship session review |


## Tools

Tools used for development of this API are;
- Documentation : [Swagger](https://swagger.io/).
- Framework: [ExpressJS](http://expressjs.com/).
- Code Editor/IDE: [VSCode](https://code.visualstudio.com), [Sublime Text](https://www.sublimetext.com/).
- Programming language: [JavaScript(ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/).
- API Testing environment: [Postman](https://www.getpostman.com).


## Getting Started
Clone the Repo.
-------------
`git clone https://github.com/kakaprodo/freementor.git`
`cd freementor`
`npm start`

## Prerequisites
The following tools will be needed to run this application successfully:
- Node v10.15.0 or above
- Npm v6.4 or above

## Deployment

- Github Pages : https://kakaprodo.github.io/freementor/UI/
- Heroku Deployment : https://freementor-db.herokuapp.com/


## Api Documentation

Get started with FreeMentor Api endpoints documentation [here](https://freementor-db.herokuapp.com/api/api-docs).

## Key Contributor

- Promesse kayenga

## Acknowledgements

- Andela Homestudy : https://homestudy.andela.com

# License

MIT
