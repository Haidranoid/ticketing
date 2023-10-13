import {Publisher, OrderCreatedEvent, Subjects} from "@hn-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  readonly subject = Subjects.OrderCreated
}
