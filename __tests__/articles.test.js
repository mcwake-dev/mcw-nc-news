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

describe("PATCH /api/articles/:article_id", () => {
  it("should respond with an updated article when passed a valid article ID and valid request body (positive)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            votes: 101,
            created_at: expect.any(String),
          })
        );
      });
  });
  it("should respond with an updated article when passed a valid article ID and valid request body (negative)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -1,
      })
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
          })
        );
      });
  });
  it("should respond with a 404 when passed a non-existent valid article ID", () => {
    return request(app).patch("/api/articles/999").expect(404);
  });
  it("should respond with a 400 when passed an invalid article ID", () => {
    return request(app).patch("/api/articles/dave").expect(400);
  });
  it("should respond with a 400 when passed a valid article ID but an invalid request body (totally invalid)", () => {
    return request(app)
      .patch("/api/articles/dave")
      .send({ nernerner: "Wrong" })
      .expect(400);
  });
  it("should respond with a 400 when passed a valid article ID but an invalid request body (key valid, value invalid)", () => {
    return request(app)
      .patch("/api/articles/dave")
      .send({ inc_votes: "Wrongety Wrong Wrong" })
      .expect(400);
  });
});
