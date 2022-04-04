import { IEventBusConnectionFactory } from '../../interfaces/event-bus-connection-factory.interface';
import { IEventBusConnection } from '../../interfaces/event-bus-connection.interface';
import { IConfiguration } from '../../../configuration/interfaces/configuration.interface';
import { EventBusConfig } from '../../consts';
import { RabbitmqConnection } from '../rabbitmq.connection';
import { Options } from 'amqplib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitmqConnectionFactory implements IEventBusConnectionFactory {

  //Connections are going to be only used through Subscribe decorator
  private connections: IEventBusConnection[];

  constructor(
    private config: IConfiguration
  ) {
  }

  async create(): Promise<IEventBusConnection[]> {
    const connections: Options.Connect[] = this.config.get(EventBusConfig.RabbitMQConnections);
    const allConnect = connections.map(async (configData: any)=> {
      const { name, hostname, port, username, password, exchange} = configData;

      const conn = new RabbitmqConnection(name, exchange);
      await conn.connect({
         hostname, port, username, password
      });

      return conn;
    })
    this.connections = await Promise.all(allConnect);
    return this.connections;
  }



}
