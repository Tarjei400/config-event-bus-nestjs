import { IConfiguration } from '../../configuration/interfaces/configuration.interface';
import { EventBusConfig, EventBusDriver } from '../consts';
import {
  IEventBusConnectionFactory,
  IRabbitMqEventBusConnectionFactory,
} from '../interfaces/event-bus-connection-factory.interface';
import { IEventBusConnection } from '../interfaces/event-bus-connection.interface';
import { Injectable } from '@nestjs/common';
import { NoEventBusFoundException } from '../exceptions/no-event-bus-found-exception';

@Injectable()
export class AbstractEventBusConnectionsFactory {

  constructor(
    private readonly config: IConfiguration,
    private readonly rabbitMqFactory: IRabbitMqEventBusConnectionFactory
  ){

  }

  selectFactory(): IEventBusConnectionFactory {
    const driver = this.config.get(EventBusConfig.Driver)
    if(EventBusDriver.RABBITMQ == driver) {
      return this.rabbitMqFactory;
    }
    throw new NoEventBusFoundException();
  }

  async create(): Promise<IEventBusConnection[]> {
    const factory = this.selectFactory();
    return await factory.create();
  }
}
