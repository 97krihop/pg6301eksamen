const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const auth = require("../../../src/server/routes/auth-api");
const {
  clearAllUsers,
  makeDefaultUser,
} = require("../../../src/server/db/users");

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
app.use("/", auth);

beforeEach(() => {
  clearAllUsers();
  makeDefaultUser();
});

export const loginAsDefaultUser = async (agent: any) => {
  const res = await agent
    .post("/login")
    .send({
      email: "test@test.com",
      password: "password1",
    })
    .set("Content-Type", "application/json");
  expect(res.statusCode).toEqual(204);
};

describe("test auth api endpoint", () => {
  it("should create user and get profile", async () => {
    const agent = request.agent(app);
    await loginAsDefaultUser(agent);
    const res = await agent.get("/profile");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      email: "test@test.com",
      firstname: "test",
      lastname: "test",
    });
  });
  it("should create new user and login as the new user", async () => {
    const agent = request.agent(app);
    await loginAsDefaultUser(agent);
    const res = await agent
      .post("/signup")
      .send({
        email: "test",
        password: "test",
        firstName: "test",
        lastName: "test",
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    const res2 = await agent
      .post("/login")
      .send({
        email: "test",
        password: "test",
      })
      .set("Content-Type", "application/json");
    expect(res2.status).toBe(204);
  });
  it("should not be able register 2 users with same email", async () => {
    const agent = request.agent(app);
    await loginAsDefaultUser(agent);
    const res = await agent
      .post("/signup")
      .send({
        email: "test",
        password: "test",
        firstName: "test",
        lastName: "test",
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    const res2 = await agent
      .post("/signup")
      .send({
        email: "test",
        password: "test",
        firstName: "test",
        lastName: "test",
      })
      .set("Content-Type", "application/json");
    expect(res2.status).toBe(401);
  });
  it("should be able to logout", async () => {
    const agent = request.agent(app);
    await loginAsDefaultUser(agent);
    const res = await agent.post("/logout");
    expect(res.status).toBe(204);
  });
  it("should not able to ping if you have no session", async () => {
    const agent = request.agent(app);
    const res = await agent.post("/logout");
    expect(res.status).toBe(401);
    const res2 = await agent.post("/login");
    expect(res2.status).toBe(401);
    const res3 = await agent.post("/signup");
    expect(res3.status).toBe(401);
    const res4 = await agent.get("/profile");
    expect(res4.status).toBe(401);
    const res5 = await agent.post("/callback");
    expect(res5.status).toBe(401);
  });
});
