import {Publisher, Subjects, TicketUpdatedEvent} from "@hn-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated;
}
