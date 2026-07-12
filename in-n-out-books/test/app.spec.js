const request = require('supertest');
const app = require('../src/app');

describe('In-N-Out Books API', () => {

  test('GET / should return landing page HTML', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('In-N-Out Books');
  });

  test('Return an array of books', async () => {
    const res = await request(app).get('/api/books');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book) => {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
    });
  });

  test('Single Book GET', async () => {
    const res = await request(app).get('/api/books/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('author');
    expect(res.body.id).toEqual(1);
    expect(res.body.title).toEqual('The Fellowship of the Ring');
  });

});

describe("Error Handling", () => {
  test('Return 400 if id is not a number', async () => {
    const res = await request(app).get('/api/books/abc');

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Input must be a number');
  });

  test('GET /invalid-route should return 404', async () => {
    const res = await request(app).get('/this-route-does-not-exist');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Resource not found');
  });

});

describe("Week 5 - Assignment 5.2: API Tests", () => {

  test("should return a 201-status code when adding a new book", async () => {
    const newBook = {
      id: 99,
      title: "The Hobbit",
      author: "J.R.R. Tolkien"
    };

    const res = await request(app)
      .post("/api/books")
      .send(newBook);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id", 99);
  });

  test("should return a 400-status code when adding a new book with missing title", async () => {
    const newBook = {
      id: 100,
      author: "J.R.R. Tolkien"
    };

    const res = await request(app)
      .post("/api/books")
      .send(newBook);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  test("should return a 204-status code when deleting a book", async () => {
    const res = await request(app)
      .delete("/api/books/99");

    expect(res.statusCode).toEqual(204);
  });

});

describe("Chapter 5 - API Tests (PUT): Week 6 - Assignment 6.2", () => {
  it("should return a 204 status code when updating a book", async () => {
    const res = await request(app)
      .put("/api/books/1")
      .send({
        title: "The Hobbit",
        author: "J.R.R. Tolkien"
      });

    expect(res.statusCode).toEqual(204);
  });

  it("should return a 400 status code when updating a book with a non-numeric id", async () => {
    const res = await request(app).put("/api/books/foo").send({
      title: "Test Book",
      author: "Test Author"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });

  it("should return a 400 status code when updating a book with a missing title", async () => {
    const res = await request(app).put("/api/books/1").send({
      author: "Test Author"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });
});
