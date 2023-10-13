import request from 'supertest'
import {app} from "../../app";

it('should respond with details about te current user', async function () {
  const cookie = await global.signin()

  console.log('whats up 7')
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200)

  expect(response.body.currentUser.email).toEqual('test@test.com')
});

it('should respond with null if no authenticated',async  function () {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

  expect(response.body.currentUser).toEqual(null)

});
