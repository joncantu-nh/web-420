const app = require('../src/app'); // Import the Express application
const request = require('supertest'); // Import Supertest for HTTP assertions

describe("Chapter 3: API Tests", () => {
  it("it should return an array of recipes", async () => {
    const res = await request(app).get("/api/recipes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((recipe) => {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("name");
      expect(recipe).toHaveProperty("ingredients");
    });
  });
});

describe('GET /', () => {
  it('should return the landing page with status 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1>Cookbook App</h1>');
    expect(response.text).toContain('<h2>Discover and Share Amazing Recipes</h2>');
  });
});

/*
describe('POST /api/recipes', () => {
  it('should create a new recipe and return it with status 201', async () => {
    const newRecipe = {
      title: 'Test Recipe',
      ingredients: ['Ingredient 1', 'Ingredient 2'],
      instructions: 'Test instructions'
    };

    const response = await request(app)
      .post('/api/recipes')
      .send(newRecipe);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', 'Test Recipe');
    expect(response.body).toHaveProperty('ingredients');
    expect(response.body).toHaveProperty('instructions', 'Test instructions');
  });
});

describe('GET /api/recipes/:id', () => {
  it('should return a specific recipe by ID with status 200', async () => {
    const newRecipe = {
      title: 'Test Recipe for GET',
      ingredients: ['Ingredient A', 'Ingredient B'],
      instructions: 'Test instructions for GET'
    };

    // First, create a new recipe to get its ID
    const postResponse = await request(app)
      .post('/api/recipes')
      .send(newRecipe);

    const recipeId = postResponse.body.id;

    const getResponse = await request(app).get(`/api/recipes/${recipeId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('id', recipeId);
    expect(getResponse.body).toHaveProperty('title', 'Test Recipe for GET');
  });
});

describe('PUT /api/recipes/:id', () => {
  it('should update a specific recipe by ID and return it with status 200', async () => {
    const newRecipe = {
      title: 'Test Recipe for PUT',
      ingredients: ['Ingredient X', 'Ingredient Y'],
      instructions: 'Test instructions for PUT'
    };

    const postResponse = await request(app)
      .post('/api/recipes')
      .send(newRecipe);

    const recipeId = postResponse.body.id;

    const updatedRecipe = {
      title: 'Updated Test Recipe for PUT',
      ingredients: ['Updated Ingredient X', 'Updated Ingredient Y'],
      instructions: 'Updated test instructions for PUT'
    };

    const putResponse = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .send(updatedRecipe);

    expect(putResponse.status).toBe(200);
    expect(putResponse.body).toHave
    Property('id', recipeId);
    expect(putResponse.body).toHaveProperty('title', 'Updated Test Recipe for PUT');
  });
});

describe('DELETE /api/recipes/:id', () => {
  it('should delete a specific recipe by ID and return status 200', async () => {
    const newRecipe = {
      title: 'Test Recipe for DELETE',
      ingredients: ['Ingredient M', 'Ingredient N'],
      instructions: 'Test instructions for DELETE'
    };

    const postResponse = await request(app)
      .post('/recipes')
      .send(newRecipe);

    const recipeId = postResponse.body.id;

    const deleteResponse = await request(app).delete(`/api/recipes/${recipeId}`);
    expect(deleteResponse.status).toBe(200);
  });
});
*/