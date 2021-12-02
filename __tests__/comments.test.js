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

describe("DELETE /api/comments/:comment_id", () => {
  it("should delete a comment for a given valid comment ID", () => request(app).delete("/api/comments/1").expect(204));
  it("should return an error if an invalid comment ID is supplied", () => request(app).delete("/api/comments/999").expect(400));
});

describe("PATCH /api/comments/:comment_id", () => {
  it("should return an updated comment when a valid comment ID and vote increment is supplied", () => request(app)
    .patch("/api/comments/1")
    .expect(200)
    .send({ inc_votes: 1 })
    .then(({ body }) => {
      expect(body.comment).toEqual({
        comment_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 17,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      });
    }));
  it("should return an updated comment when a valid comment ID and vote decrement is supplied", () => request(app)
    .patch("/api/comments/1")
    .expect(200)
    .send({ inc_votes: -1 })
    .then(({ body }) => {
      expect(body.comment).toEqual({
        comment_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      });
    }));
  it("should return an error if an invalid comment ID is supplied", () => request(app).patch("/api/comments/999").expect(400));
  it("should return an error if an invalid vote increment/decrement is supplied (invalid key)", () => request(app)
    .patch("/api/comments/1")
    .send({ blahblahblah: 1 })
    .expect(400));
  it("should return an error if an invalid vote increment/decrement is supplied (invalid value)", () => request(app)
    .patch("/api/comments/1")
    .send({ inc_votes: "plus_one" })
    .expect(400));
});
