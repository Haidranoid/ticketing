import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../../models/ticket";
import {natsWrapper} from "../../nats-wrapper";

it('has a route handler listening to /api/tickets for post requests', async function () {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)
});

it('can only be accessed if the user is signed in', async function () {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).toEqual(401)
});

it('returns a status other than 401 if the user is signed in', async function () {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(response.status).not.toEqual(401)
});

it('returns an error if an invalid title is provided', async function () {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400)
});

it('returns an error if an invalid price is provided', async function () {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'my custom title',
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'adfasdf',
      price: -10
    })
    .expect(400)
});

it('creates a ticket with valid inputs', async function () {
  // add in a check to make sure a ticket was saved
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const title = 'adfasdf'

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20
    })
    .expect(201)

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20)
  expect(tickets[0].title).toEqual(title)
});

it('should publish an event',async function () {
  const title = 'aslkjfl'

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20
    })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
}); 
