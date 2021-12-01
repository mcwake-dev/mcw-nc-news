exports.endpoints = {
  "GET /api/topics": {
    description: "Serves array of all topics",
    queries: [],
    exampleResponse: {
      topics: [{ slug: "football", description: "Footie!" }],
    },
  },
  "GET /api/users": {
    description: "Serves array of all users",
    queries: [],
    exampleResponse: {
      users: [{ username: "dave" }, { username: "bob" }, { username: "brian" }],
    },
  },
  "GET /api/users/:username": {
    description: "Gets a single user with the given username",
    exampleResponse: {
      user: {
        username: "dave",
        avatar_url: "https://avatar.com/daves_avatar.jpg",
        name: "Brian",
      },
    },
  },
  "GET /api/articles/:article_id": {
    description: "Serves a single article for the given article ID",
    exampleResponse: {
      article: {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
    },
  },
  "PATCH /api/articles/:article_id": {
    description:
      "Updates vote count on a article with the given article ID, returning the updated article",
    exampleBody: { inc_votes: 1 },
    exampleResponse: {
      article: {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 101,
      },
    },
  },
  "GET /api/articles": {
    description: "Serves array of all articles",
    queries: ["author", "topic", "sort_by", "order"],
    exampleResponse: {
      article: {
        title: "Seafood substitutions are increasing",
        topic: "cooking",
        author: "weegembump",
        body: "Text from the article..",
        created_at: 1527695953341,
      },
    },
  },
  "GET /api/articles/:article_id/comments": {
    description: "Gets comments for an article with the given article ID",
    exampleResponse: {
      comments: [
        {
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 14,
          author: "butter_bridge",
          article_id: 1,
          created_at: new Date(1604113380000),
        },
        {
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
          votes: 100,
          author: "icellusedkars",
          article_id: 1,
          created_at: new Date(1583025180000),
        },
      ],
    },
  },
  "POST /api/articles/:article_id/comments": {
    description: "Add a new comment for the article with the given article ID",
    exampleBody: { username: "bob", body: "A nice comment" },
    exampleResponse: {
      comment: {
        body: "A nice comment",
        votes: 0,
        author: "bob",
        article_id: 1,
        created_at: new Date(1583025180000),
      },
    },
  },
  "DELETE /api/comments/:comment_id": {
    description: "Remove a comment with the given comment ID",
  },
  "GET /api": {
    description:
      "Serves JSON representation of the available API endpoints for this API",
  },
};

exports.getEndpoints = async (req, res, next) => {
  res.status(200).send(this.endpoints);
};
