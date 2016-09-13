# API

We have a JSON-API (mock) with CRUD (Create, Read, Update, Delete) endpoints
that should be used. It's accessible by running the following:

- `npm install` Install the json-server package
- `npm start` Launch the json-server, see package.json for what it does

Then you are ready to interact with the API from the browser.

You can for example delete a supplier from the command line like this:
`curl -X "DELETE" http://localhost:3000/suppliers/2`.

See more about the tool we are using here
https://github.com/typicode/json-server and take a look at the file db.json for
adding more suppliers to the mock data.
