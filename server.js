var express = require("express");
var graphqlHTTP = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const cors = require("cors");

// build schema
// ! means required
const schema = buildSchema(`
  type Person {
    name: String
    job: String
  }
  type Query {
    name(id: Int!): String
    job(id: Int!): String
    person(id: Int!): Person
  }
`);

var fakeDatabase = {
  1: {
    name: "Alice",
    job: "Student",
  },
  2: {
    name: "Bob",
    job: "Teacher",
  },
  3: {
    name: "Cathy",
    job: "Engineer",
  },
};

const root = {
  name: ({ id }) => {
    if (id == 1) {
      return "Alice";
    } else if (id == 2) {
      return "Bob";
    } else if (id == 3) {
      return "Cathy";
    }
    return "Wrong id";
  },
  job: ({ id }) => {
    if (id == 1) {
      return "Student";
    } else if (id == 2) {
      return "Teacher";
    } else if (id == 3) {
      return "Engineer";
    }
    return "Wrong id";
  },
  person: ({ id }) => {
    if (id in fakeDatabase) {
      return fakeDatabase[id];
    }
    return {
      name: "Wrong id",
      job: "Wrong id",
    };
  },
};

const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(3300);
console.log("Running at http://localhost:3300/graphql");
