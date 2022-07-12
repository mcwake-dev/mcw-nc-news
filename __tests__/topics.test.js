const { expect, it, describe, beforeAll, afterAll } = require("@jest/globals");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeAll(async () => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/topics", () => {
  it("should respond with an array of topics", () =>
    request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      }));
});

describe("POST /api/topics", () => {
  it("should create and return a new topic when supplied with a new slug and description", () =>
    request(app)
      .post("/api/topics")
      .send({ slug: "new-topic", description: "test topic" })
      .expect(201)
      .then(({ body: { topic } }) =>
        expect(topic).toEqual({
          slug: "new-topic",
          description: "test topic",
        })
      ));
  it("should return a 400 error if the slug is missing", () =>
    request(app)
      .post("/api/topics")
      .send({ bob: "Brian", description: "A description" })
      .expect(400));
  it("should return a 400 error if the description is missing", () =>
    request(app)
      .post("/api/topics")
      .send({ slug: "test-topic-2", dave: "Test topic 2" })
      .expect(400));
});
