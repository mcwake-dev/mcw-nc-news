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

describe("DELETE /api/comments/:comment_id", () => {
  it("should delete a comment for a given valid comment ID", async () => {
    const result = await db.query(
      `
      INSERT INTO comments(body, votes, author, article_id) VALUES ($1, $2, $3, $4) RETURNING * ;
    `,
      [
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        16,
        "butter_bridge",
        9,
      ]
    );
    const commentToDelete = result.rows[0];

    return await request(app)
      .delete(`/api/comments/${commentToDelete.comment_id}`)
      .expect(204);
  });
  it("should return an error if an invalid comment ID is supplied", () =>
    request(app).delete("/api/comments/999").expect(400));
});

describe("PATCH /api/comments/:comment_id", () => {
  it("should return an updated comment when a valid comment ID and vote increment is supplied", () =>
    request(app)
      .patch("/api/comments/1")
      .expect(200)
      .send({ inc_votes: 1 })
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      }));
  it("should return an updated comment when a valid comment ID and vote decrement is supplied", () =>
    request(app)
      .patch("/api/comments/1")
      .expect(200)
      .send({ inc_votes: -1 })
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      }));
  it("should return an error if an invalid comment ID is supplied", () =>
    request(app).patch("/api/comments/999").send({ inc_votes: 1 }).expect(404));
  it("should return an error if an invalid vote increment/decrement is supplied (invalid key)", () =>
    request(app)
      .patch("/api/comments/1")
      .send({ blahblahblah: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({});
      }));
  it("should return an error if an invalid vote increment/decrement is supplied (invalid value)", () =>
    request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "plus_one" })
      .expect(400));
});

describe("GET /api/comments/recent", () => {
  it("should return a list of the top three most recent comments with the article title included", () =>
    request(app)
      .get("/api/comments/recent")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      }));
});

describe("GET /api/comments/highest", () => {
  it("should return a list of the top three highest voted comments with the article title included", () =>
    request(app)
      .get("/api/comments/recent")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      }));
});
