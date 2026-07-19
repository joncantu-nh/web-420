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

  it("should return a 400 status code when adding a recipe with missing name", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .send({
        id: 100,
        ingredients: ["bread", "cheese", "butter"]
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

});

describe("Chapter 5: Test for PUT", () => {
  it("should return a 204 status code when updating a recipe", async () => {
    const res = await request(app)
      .put("/api/recipes/1")
      .send({
        name: "Pancakes",
        ingredients: ["flour", "milk", "eggs", "sugar"]
      });

    expect(res.statusCode).toEqual(204);
  });

  it("should return a 400 status code when updating a recipe with a non-numeric id", async () => {
    const res = await request(app).put("/api/recipes/foo").send({
      name: "Test Recipe",
      ingredients: ["test", "test"]
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });

  it("should return a 400 status code when updating a recipe with missing keys or extra keys", async () => {
    const res = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
    const res2 = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe",
      ingredients: ["test", "test"],
      extraKey: "extra"
    });
    expect(res2.statusCode).toEqual(400);
    expect(res2.body.message).toEqual("Bad Request");
  });
});

describe("Chapter 6: Test for Authorization and Authentication", () => {
  it("should return a 200 status code with a message of 'Registration successful' when registering a new user", async () => {
    const res = await request(app).post("/api/register").send({
      email: "cedric@hogwarts.edu",
      password: "diggory"
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Registration successful");
  });
});

describe("DELETE /api/recipes/:id", () => {
  it("should delete a specific recipe and return 204", async () => {
    const newRecipe = {
      id: 101,
      name: "Grilled Cheese",
      ingredients: ["bread", "cheese", "butter"]
    };

    const postResponse = await request(app)
      .post("/api/recipes")
      .send(newRecipe);

    expect(postResponse.statusCode).toEqual(201);

    const deleteResponse = await request(app)
      .delete(`/api/recipes/${postResponse.body.id}`);

    expect(deleteResponse.statusCode).toEqual(204);
  });
});
