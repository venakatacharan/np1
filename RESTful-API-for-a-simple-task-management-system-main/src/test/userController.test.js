const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/userModel');
const userController = require('../controllers/userController');

// Mocking dependencies
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('validator');
jest.mock('../models/userModel');

const app = express();
app.use(express.json());

app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);

describe('User Controller', () => {
  describe('registerUser', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/register').send({ email: '', password: '' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('All fields must be filled');
    });

    it('should return 400 if email is not valid', async () => {
      validator.isEmail.mockReturnValue(false);
      const res = await request(app).post('/register').send({ email: 'invalidemail', password: 'Password123!' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email is not valid');
    });

    it('should return 400 if password is not strong enough', async () => {
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(false);
      const res = await request(app).post('/register').send({ email: 'test@test.com', password: 'weak' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Password is not strong enough');
    });

    it('should return 400 if email already exists', async () => {
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(true);
      User.findOne.mockResolvedValue({ email: 'test@test.com' });
      const res = await request(app).post('/register').send({ email: 'test@test.com', password: 'Password123!' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already exists');
    });

    it('should return 201 and create user if data is valid', async () => {
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(true);
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.create.mockResolvedValue({ _id: '123', email: 'test@test.com', password: 'hashedpassword' });
      jwt.sign.mockReturnValue('token');
      
      const res = await request(app).post('/register').send({ email: 'test@test.com', password: 'Password123!' });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.tokenid).toBe('token');
      expect(res.body.data.email).toBe('test@test.com');
    });

    it('should return 500 if there is a server error', async () => {
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(true);
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error('Hash error'));
      const res = await request(app).post('/register').send({ email: 'test@test.com', password: 'Password123!' });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Internal server error');
    });
  });

  describe('loginUser', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/login').send({ email: '', password: '' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('All fields must be filled');
    });

    it('should return 400 if email does not exist', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'Password123!' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return 400 if password is incorrect', async () => {
      User.findOne.mockResolvedValue({ email: 'test@test.com', password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(false);
      const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'WrongPassword' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return 200 and login user if credentials are correct', async () => {
      User.findOne.mockResolvedValue({ _id: '123', email: 'test@test.com', password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');
      const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'Password123!' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User logged in successfully');
      expect(res.body.tokenid).toBe('token');
      expect(res.body.data.email).toBe('test@test.com');
    });

    it('should return 500 if there is a server error', async () => {
      User.findOne.mockRejectedValue(new Error('Find error'));
      const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'Password123!' });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Internal server error');
    });
  });
});
