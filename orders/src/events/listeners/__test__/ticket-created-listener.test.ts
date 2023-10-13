import {TicketCreatedEvent} from "@hn-tickets/common";
import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import mongoose, {set} from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}
it('should create and saves a ticket', async function () {
  const {listener, data, msg} = await setup()
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)
  // write assertion to make sure a ticket was created
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)

});

it('should ack the message', async function () {
  const {data, listener, msg} = await setup()
  // call the onMessage function with the data object + message object
  await listener.onMessage(data,msg)

  // write assertion to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled()
});
