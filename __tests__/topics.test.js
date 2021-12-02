const {
  expect, it, describe, beforeAll, afterAll,
} = require("@jest/globals");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeAll(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/topics", () => {
  it("should respond with an array of topics", () => request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      body.topics.forEach((topic) => {
        expect(topic).toEqual(
          expect.objectContaining({
            description: expect.any(String),
            slug: expect.any(String),
          }),
        );
      });
    }));
});
