import mongoose from "mongoose";
import {TicketUpdatedEvent} from "@hn-tickets/common";
import {TicketUpdatedListener} from "../ticket-updated-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {Message} from "node-nats-streaming";

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client)
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })

  await ticket.save()
  // create a fake message object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'abdfadf'
  }
  // create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  // return all of this stuff
  return {msg, data, ticket, listener}
}
it('should find, updates and saves a ticket', async function () {
  const {msg, data, ticket, listener} = await setup();

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
});

it('should ack the message', async function () {
  const {msg, data, listener} = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
});

it('should doesn\'t call ack if the event has a skipped version number', async function () {
  const {msg, data, listener, ticket} = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg)
  } catch (e) {

  }

  expect(msg.ack).not.toHaveBeenCalled()
});
