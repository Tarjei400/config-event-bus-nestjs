import { IEventBusConnection } from './event-bus-connection.interface';

export abstract class IEventBusConnectionFactory {
  abstract create(): Promise<IEventBusConnection[]>;
}

export abstract class IRabbitMqEventBusConnectionFactory extends IEventBusConnectionFactory {

}
