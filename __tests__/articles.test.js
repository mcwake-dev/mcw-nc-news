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

describe("GET /api/articles", () => {
  it("should return a list of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("sort_by", () => {
    it("should be able return a list of articles sorted by title", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", { descending: true });
        });
    });
    it("should be able return a list of articles sorted by title", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic", { descending: true });
        });
    });
    it("should be able return a list of articles sorted by title", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("should be able return a list of articles sorted by title", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes", { descending: true });
        });
    });
    it("should be able return a list of articles sorted by comment count", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual(
            body.articles.sort((a, b) => {
              if (a.comment_count !== b.comment_count) {
                return a.comment_count - b.comment_count;
              } else {
                return a.title.localeCompare(b.title);
              }
            })
          );
        });
    });
    it("should throw an error if an invalid sort parameter is passed", () => {
      return request(app)
        .get("/api/articles?sort_by=bananas")
        .expect(400)
        .then(({ body }) =>
          expect(body.msg).toEqual("Articles: Invalid sort parameter")
        );
    });
  });
  describe("order", () => {
    it("should sort articles in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("should sort articles in descending order when requested", () => {
      return request(app)
        .get("/api/articles?sort=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("should sort articles in ascending order when requested", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
    });
    it("should throw an error if an invalid sort order parameter is passed", () => {
      return request(app)
        .get("/api/articles?order=bizarre")
        .expect(400)
        .then(({ body }) =>
          expect(body.msg).toEqual("Articles: Invalid sort order parameter")
        );
    });
  });
  describe("topic", () => {
    it("should return a list of articles filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          body.articles.every((article) => article.topic === "cats");
        });
    });
    it("should return an error if the topic provided does not exist", () => {
      return request(app)
        .get("/api/articles?topic=fweljkfaweljkfawejlkafwe")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Articles: Invalid topic");
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should return a list of comments for a valid article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  it("should return a 204 error for an article with no comments", () => {
    return request(app).get("/api/articles/999/comments").expect(204);
  });
  it("should return a 400 error for invalid article ID", () => {
    return request(app)
      .get("/api/articles/:bob/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("should create and return a new comment when passed a valid article ID, username and comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "A nice comment" })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "A nice comment",
            votes: 0,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          })
        );
      });
  });
  it("should return a 400 error for invalid article ID", () => {
    return request(app)
      .post("/api/articles/:bob/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("should return an error when passed an invalid comment object (invalid keys)", () => {
    return request(app)
      .post("/api/articles/:bob/comments")
      .send({ nanana: "sirnotappearinginthisapi", nernerner: "A nice comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("should return an error when passed an invalid username", () => {
    return request(app)
      .post("/api/articles/:bob/comments")
      .send({ username: "sirnotappearinginthisapi", body: "A nice comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
