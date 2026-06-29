const request = require('supertest');
const app = require('../src/app');

describe('In-N-Out Books API Tests', () => {

  test('GET / should return landing page HTML', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('In-N-Out Books');
  });

  test('GET /invalid-route should return 404', async () => {
    const res = await request(app).get('/this-route-does-not-exist');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Resource not found');
  });

  test('500 error handler should return JSON error response', async () => {

    // Temporarily inject a failing route
    app.get('/error-test', (req, res) => {
      throw new Error('Forced server error');
    });

    const res = await request(app).get('/error-test');

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Forced server error');
    expect(res.body).toHaveProperty('status', 500);
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

  test('Return 400 if id is not a number', async () => {
    const res = await request(app).get('/api/books/abc');

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Input must be a number');
  });

});