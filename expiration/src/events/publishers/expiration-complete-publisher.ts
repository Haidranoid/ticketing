import {Subjects, Publisher, ExpirationCompleteEvent} from '@hn-tickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
