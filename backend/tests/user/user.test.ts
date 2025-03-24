import request from 'supertest';
import app from '../../src/index';
import { Server } from 'http';
import mongoose from 'mongoose';

describe('User Endpoints', () => {
  let server: Server;
  let token: string;
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // Inicia o servidor em uma porta aleatória
    server = app.listen(0);

    let loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: user.email, password: user.password });

    if (loginResponse.status !== 200) {
      await request(app).post('/auth/register').send(user).expect(201);
      loginResponse = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200);
    }

    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Fecha o servidor após os testes

  });

  it('should return user profile when valid token is provided', async () => {
    const response = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
  });

  it('should return unauthorized if no token is provided', async () => {
    await request(app).get('/users/profile').expect(401);
  });
});
