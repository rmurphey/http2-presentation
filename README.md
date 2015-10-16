# http/2 playground

This repo is a sandbox for playing with [HTTP/2](https://httpwg.github.io/specs/rfc7540.html). It may be in a broken state at any time.

## setup

- `npm install`

## starting a server

- `npm run http1` creates an HTTP/1.1 server on port 3000
- `npm run http2` creates an HTTP/2 server on port 3001

## test pages

Scout loads a single application file:

- https://localhost:3000/example-h1-app.html
- https://localhost:3001/example-h1-app.html

Scout loads multiple application files:

- https://localhost:3000/example-h2-app.html
- https://localhost:3001/example-h2-app.html

Scout loads multiple application files, with some server push:

- https://localhost:3000/example-h2-app-push.html
- https://localhost:3001/example-h2-app-push.html
