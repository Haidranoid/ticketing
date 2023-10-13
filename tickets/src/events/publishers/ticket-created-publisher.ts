import {Publisher, Subjects, TicketCreatedEvent} from "@hn-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
}
