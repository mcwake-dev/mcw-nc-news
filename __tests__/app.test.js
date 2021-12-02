const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const db = require("../db/connection");
const fs = require("fs").promises;
const path = require("path");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const { endpoints } = require("../controllers/api.controller");

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

describe("GET /api", () => {
  it("should return a JSON representation of all available API endpoints", () => {
    const filePath = path.join(__dirname, "../endpoints.json");

    return fs.readFile(filePath).then((file) => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(JSON.stringify(body)).toEqual(JSON.stringify(file));
        });
    });
  });
});
