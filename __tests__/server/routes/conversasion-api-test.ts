const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const auth = require("../../../src/server/routes/auth-api");
const conversations = require("../../../src/server/routes/conversasion-api");
import { loginAsDefaultUser } from "./auth-api-test";

const {
  clearAllUsers,
  makeDefaultUser,
} = require("../../../src/server/db/users");
const {
  clearMessages,
  createNewMessage,
  addMessage,
} = require("../../../src/server/db/messages");

const app = express();

const sessionParser = session({
  secret: "test",
  resave: false,
  saveUninitialized: false,
});

//use middleware
app.use(bodyParser.json());
app.use(sessionParser);

//route to test
app.use("/", conversations);
app.use("/", auth);

beforeEach(() => {
  clearMessages();
  clearAllUsers();
  makeDefaultUser();
});

const loadDefaultMessages = (name: string) => {
  createNewMessage(JSON.stringify([name]), [name]);
  addMessage(JSON.stringify([name]), {
    email: name + "@test.com",
    message: name,
  });
};

describe("test conversation endpoints", () => {
  it("should return 401", async () => {
    const agent = request.agent(app);
    const res = await agent.post("/messages");
    expect(res.status).toBe(401);
    const res2 = await agent.get("/messages/all");
    expect(res2.status).toBe(401);
  });
  it("should return be able to post massage", async () => {
    loadDefaultMessages("test");
    const agent = request.agent(app);
    await loginAsDefaultUser(agent);
    const res = await agent
      .post("/messages")
      .send({
        recipients: ["test"],
      })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: [{ email: "test@test.com", message: "test" }],
      recipients: ["test"],
    });
  });
  it("should return be able to get all massages to one user", async () => {
    loadDefaultMessages("test@test.com");
    loadDefaultMessages("test@test.com");
    loadDefaultMessages("test");
    const agent = request.agent(app);
    await loginAsDefaultUser(agent);
    const res = await agent.get("/messages/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { email: "test@test.com@test.com", message: "test@test.com" },
      { email: "test@test.com@test.com", message: "test@test.com" },
    ]);
  });
});
