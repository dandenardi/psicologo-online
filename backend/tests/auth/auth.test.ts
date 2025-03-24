import request from 'supertest';
import mongoose from 'mongoose';
import { Server } from 'http';
import app from '../../src/index';
describe('Authentication Endpoints', () => {
  let server: Server;
  let token: string;

  const user = {
    name: 'John Doe',
    email: 'auth.tester@example.com', // Email único para evitar conflitos
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

  it('should return an error if credentials are invalid', async () => {
    await request(app)
      .post('/auth/login')
      .send({ email: user.email, password: 'wrongpassword' })
      .expect(400);
  });

  it('should return an error if email does not exist', async () => {
    await request(app)
      .post('/auth/login')
      .send({ email: 'not.exist@example.com', password: 'password123' })
      .expect(400);
  });
});
