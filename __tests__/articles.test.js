const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeAll(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/articles/:article_id", () => {
  it("should respond with a valid article object when passed a valid article ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            votes: 100,
            created_at: expect.any(String),
            comment_count: expect.any(String), // Returns BIGINT which has no equivalent in JS
          })
        );
      });
  });
  it("should respond with a 404 when passed a non-existent valid article ID", () => {
    return request(app).get("/api/articles/999").expect(404);
  });
  it("should respond with a 400 when passed an invalid article ID", () => {
    return request(app).get("/api/articles/dave").expect(400);
  });
});
