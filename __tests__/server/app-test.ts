const path = require("path");
const fs = require("fs");

const request = require("supertest");
const { app } = require("../../src/server/app");

it("should return index.html", async () => {
  const res = await request(app).get("/");
  expect(res.status).toBe(200);
  expect(res.headers).toHaveProperty(
    "content-type",
    "text/html; charset=UTF-8"
  );

  const buffer = fs.readFileSync(
    path.resolve(__dirname, "..", "..", "dist", "index.html")
  );
  expect(res.text).toEqual(buffer.toString());
});
it("should return 404", async () => {
  const res = await request(app).get("/api");
  expect(res.status).toBe(404);
});
