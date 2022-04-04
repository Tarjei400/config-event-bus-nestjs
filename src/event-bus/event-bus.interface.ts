export abstract class IEventBus {
  abstract send(topic: string, payload: any): void
  abstract receive(topic: string);
}
