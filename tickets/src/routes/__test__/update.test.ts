import request from "supertest";
import mongoose from "mongoose";
import {app} from "../../app";

it('should return a 404 if the provided id does not exist', async function () {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'a valid title',
      price: 20
    })
    .expect(404)
});

it('should return a 401 if the user is not authenticated', async function () {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'a valid title',
      price: 20
    })
    .expect(401)
});

it('should return a 401 if the user does not own the ticket', async function () {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfkd',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ajdlfja sldjfld',
      price: 100
    })
    .expect(401)
});

it('should return a 400 if the user provides an invalid title or price',async  function () {

  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdfkd',
      price: 20
    })

   await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    }).expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'afdasdf',
      price: -20
    }).expect(400)
});

it('should update the ticket provided', async function () {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdfkd',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'other title',
      price: 100
    }).expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual('other title')
  expect(ticketResponse.body.price).toEqual(100)
});
