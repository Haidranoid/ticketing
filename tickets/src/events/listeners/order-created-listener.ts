import {Message} from "node-nats-streaming";
import {Listener, OrderCreatedEvent, Subjects} from "@hn-tickets/common";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";
import {natsWrapper} from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)
    // if not ticket, throw error
    if (!ticket){
      throw new Error('Ticket not found')
    }

    // mark the ticket as being reserved by settings its orderId
    ticket.set({orderId: data.id})

    // save the ticket
    await ticket.save()
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })

    // ack the message
    msg.ack()
  }
}
