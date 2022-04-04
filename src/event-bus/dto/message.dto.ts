export abstract class MessageDto {
  payload: any;

  abstract ack(): Promise<any>;
  abstract nack(): Promise<any>;
}
