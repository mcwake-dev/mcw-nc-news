const { expect, it, describe, beforeAll, afterAll } = require("@jest/globals");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeAll(async () => await seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/users", () => {
  it("should respond with an array of users", () =>
    request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        expect(users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              username: expect.any(String),
              firstname: expect.any(String),
              surname: expect.any(String),
              avatar_url: expect.any(String),
              articlecount: expect.any(String),
              articlevotes: expect.any(String),
              commentcount: expect.any(String),
              commentvotes: expect.any(String),
            }),
          ])
        );
      }));
});

describe("GET /api/users/:username", () => {
  it("should respond with a user when supplied with a valid existing username", () =>
    request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            firstname: expect.any(String),
            surname: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
      }));
  it("should respond with a user when supplied with a valid but non-existent username", () =>
    request(app)
      .get("/api/users/sirnotappearinginthisapi")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Users: User not found");
      }));
});

describe("GET /api/users/exists/:username", () => {
  it("should response with true when supplied with a valid existing username", () =>
    request(app)
      .get("/api/users/exists/butter_bridge")
      .expect(200)
      .then(({ body: { exists } }) => {
        expect(exists).toBe(true);
      }));
  it("should response with false when supplied with a valid non-existent username", () =>
    request(app)
      .get("/api/users/exists/sirnotappearinginthisapi")
      .expect(200)
      .then(({ body: { exists } }) => {
        expect(exists).toBe(false);
      }));
  it("should response with false when not supplied with a username", () =>
    request(app).get("/api/users/exists/").expect(400));
});

describe("POST /api/users", () => {
  it("should create and return a new user when supplied with valid user details", () =>
    request(app)
      .post("/api/users")
      .send({
        username: "testuser1",
        firstName: "Test",
        surname: "User",
        password: "mypassword",
        avatar_url: "https://via.placeholder.com/150",
      })
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            firstname: expect.any(String),
            surname: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
        expect(user.password).toBe(undefined);
      }));
  it("should return an error when I try to create the same user again", () =>
    request(app)
      .post("/api/users")
      .send({
        username: "testuser1",
        firstName: "Test",
        surname: "User",
        password: "mypassword",
        avatar_url: "https://via.placeholder.com/150",
      })
      .expect(400));
  it("should return an error when I try to create a user with fields missing (username)", () =>
    request(app)
      .post("/api/users")
      .send({
        firstName: "Test",
        surname: "User",
        password: "mypassword",
        avatar_url: "https://via.placeholder.com/150",
      })
      .expect(400));
  it("should return an error when I try to create a user with fields missing (password)", () =>
    request(app)
      .post("/api/users")
      .send({
        username: "testuser2",
        firstName: "Test",
        surname: "User",
        avatar_url: "https://via.placeholder.com/150",
      })
      .expect(400));
});
