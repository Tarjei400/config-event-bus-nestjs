import { Subject } from 'rxjs';

export abstract class IEventBusConnection {

  abstract receive(cb: (msg: any, queue?: string) => void, queue?: string,  autoAck?: boolean);

  abstract send(payload: any, topic?: string): void;

  abstract getName(): string;

  abstract initialize(queue: string, topic: string);

  abstract onConnectionStarted(): Subject<boolean>;
}
