import {Publisher, OrderCancelledEvent, Subjects} from "@hn-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
