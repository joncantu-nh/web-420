const app = require('../src/app'); // Import the Express application
const request = require('supertest'); // Import Supertest for HTTP assertions

describe("Chapter 3: API Tests", () => {
  it('should return the landing page with status 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1>Cookbook App</h1>');
    expect(response.text).toContain('<h2>Discover and Share Amazing Recipes</h2>');
  });

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

describe('Chapter 4: API Tests', () => {
  it('should create a new recipe and return it with status 201', async () => {
    const newRecipe = {
      id: 99,
      name: 'Grilled Cheese',
      ingredients: ['bread', 'cheese', 'butter']
    };

    const response = await request(app)
      .post('/api/recipes')
      .send(newRecipe);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 99);
  });

  it('should return a specific recipe by ID with status 201', async () => {
    const newRecipe = {
      id: 99,
      name: 'Grilled Cheese',
      ingredients: ['bread', 'cheese', 'butter']
    };

    const postResponse = await request(app)
      .post('/api/recipes')
      .send(newRecipe);

    const recipeId = postResponse.body.id;

    const getResponse = await request(app).get(`/api/recipes/${recipeId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('id', recipeId);
    expect(getResponse.body).toHaveProperty('name', 'Grilled Cheese');
  });

  it("should return a 400 status code when adding a new recipe with missing name", async () => {
    const res = await request(app).post("/api/recipes").send({
      id: 100,
      ingredients: ["bread", "cheese", "butter"]
    });
  });

  it("should return a 204 status code when deleting a recipe", async () => {
    const res = await request(app).delete("/api/recipes/99");
    expect(res.statusCode).toEqual(204);
  });

});

/*
describe('PUT /api/recipes/:id', () => {
  it('should update a specific recipe by ID and return it with status 201', async () => {
    const newRecipe = {
      name: 'Grilled Cheese',
      ingredients: ['bread', 'cheese', 'butter'],
      instructions: '1. Butter the bread.\n2. Place cheese between slices.\n3. Grill until golden brown.'
    };

    const postResponse = await request(app)
      .post('/api/recipes')
      .send(newRecipe);

    const recipeId = postResponse.body.id;

    const updatedRecipe = {
      name: 'Updated Grilled Cheese',
      ingredients: ['Updated bread', 'Updated cheese', 'Updated butter'],
      instructions: '1. Butter the updated bread.\n2. Place updated cheese between slices.\n3. Grill until updated golden brown.'
    };

    const putResponse = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .send(updatedRecipe);

    expect(putResponse.status).toBe(201);
    expect(putResponse.body).toHave
    Property('id', recipeId);
    expect(putResponse.body).toHaveProperty('name', 'Updated Grilled Cheese');
  });
});

describe('DELETE /api/recipes/:id', () => {
  it('should delete a specific recipe by ID and return status 201', async () => {
    const newRecipe = {
      name: 'Grilled Cheese',
      ingredients: ['bread', 'cheese', 'butter'],
      instructions: '1. Butter the bread.\n2. Place cheese between slices.\n3. Grill until golden brown.'
    };

    const postResponse = await request(app)
      .post('/api/recipes')
      .send(newRecipe);

    const recipeId = postResponse.body.id;

    const deleteResponse = await request(app).delete(`/api/recipes/${recipeId}`);
    expect(deleteResponse.status).toBe(201);
  });
});
  */

