const express = require("express");
const morgan = require("morgan")
const app = express();

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unkown endpoint'})
}

app.use(express.json());
app.use(requestLogger)
app.use(morgan("tiny"))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const d = new Date();
  response.send(
    "<p>Phonebook has info for " + persons.length + " people</p>" + d
  );
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find(
    (person) => person.id === Number(request.params.id)
  );
  console.log(person, typeof person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((person) => person.id != Number(request.params.id));

  response.status(204).end();
});

function getRandomId() {
  return Math.floor(Math.random() * 10000);
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    response.status(400).json({
        error:'name missing'
    })
  }

  if (!body.number) {
    response.status(400).json({
        error: "number missing"
    })
  }

  if (persons.map(person => person.name).includes(body.name)){
    response.status(400).json({
        error: "name already in phonebook"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandomId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
