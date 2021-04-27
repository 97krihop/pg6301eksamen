[![Node.js CI](https://github.com/97krihop/pg6301eksamen/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/97krihop/pg6301eksamen/actions/workflows/node.js.yml)

# pg6301 Exam 2021
## How to use the application ##
 need to run `yarn start or yarn build` before `yarn test` for all tests to pass
 - `yarn install`
 - `yarn build`
 - `yarn test`
 - `yarn start`

# 

- A new user can login with google.
- A logedin user can create a new user without google account.
- A user can send messages to recipients and receive messages using websockets.
- A user can se their profile and picture if they have it on google.
- A user will receive notification if they receive a message, but they are not on the home screen("/").
- The server can run with or without HTTPS by adding and removing `server.crt` and `server.key`
- The server can also run on different port then `3000` if you specify `PORT` as a ENV, ether by adding it in .env or in
  the commandline
- The server can also change the session Secret by specifying it as a ENV `SESSION_SECRET`

#### Technologies used:

    * TypeScript
    * React
    * Express
    * Parcel
    * prettier
    * jest
    * testing-library/react
    * jest-websocket-mock
    * fetch-mock-jest
    * and more

* Endpoints:
    * GET /api/profile
    * POST /api/login
    * POST /api/signup
    * POST /api/logout
    * POST /api/callback
    * POST /api/messages
    * GET /api/messages/all
  
* WebSockets:
    * upgrade /notify
    * upgrade /
