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

describe("GET /api/sir-not-appearing/in-this-app", () => {
  it("should return a 404 error for a non-existent endpoint", () => {
    return request(app).get("/api/sir-not-appearing/in-this-app").expect(404);
  });
});
