import request from 'supertest'
import {app} from '../../app'

it('should returns a 201 on successful signup', function () {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
});

it('should returns a 400 with an invalid email', function () {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'adfadsf',
      password: 'password'
    })
    .expect(400)
});

it('should returns a 400 with an invalid password', function () {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'adfadsf',
      password: 'ap'
    })
    .expect(400)
});

it('should returns a 400 with missing email and password', async function () {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400)

  return request(app)
    .post('/api/users/signup')
    .send({
      password: 'alskdf'
    })
    .expect(400)
});


it('should disallows ducplicate emails', async function () {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
});


it('should sets a cookie after successful signup', async function () {

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })

  expect(response.get("Set-Cookie")).toBeDefined()
});


