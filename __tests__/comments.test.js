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

describe("DELETE /api/comments/:comment_id", () => {
  it("should delete a comment for a given valid comment ID", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("should return an error if an invalid comment ID is supplied", () => {
    return request(app).delete("/api/comments/999").expect(400);
  });
});
