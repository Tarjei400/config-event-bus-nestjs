import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { EventBusInstaller } from './event-bus.installer';
import {
  IEventBusConnectionFactory,
  IRabbitMqEventBusConnectionFactory,
} from './interfaces/event-bus-connection-factory.interface';
import { RabbitmqConnectionFactory } from './rabbit-mq/factory/rabbitmq-connection.factory';
import { AbstractEventBusConnectionsFactory } from './factories/abstract-event-bus-connections.factory';


@Module({
  imports: [
    DiscoveryModule
  ],
  controllers: [],

  exports: [EventBusInstaller]
})
export class EventBusModule {
  constructor(
    private readonly installer: EventBusInstaller
  ) {}

  public async onModuleInit() {
    await this.installer.install()
  }

  static forRootAsync(options): DynamicModule {

    return {
      module: EventBusModule,
      providers: [
        {
          provide: IRabbitMqEventBusConnectionFactory,
          useClass: RabbitmqConnectionFactory,
        },
        {
          provide: IEventBusConnectionFactory,
          useClass: AbstractEventBusConnectionsFactory
        },

        EventBusInstaller,

        {
          provide: 'EVENT_BUS_CONNECTIONS',
          useFactory: async (factory: IEventBusConnectionFactory) => await factory.create(),
          inject: [IEventBusConnectionFactory]
        }
      ],

      exports: [EventBusInstaller, 'EVENT_BUS_CONNECTIONS'],
    };
  }
}
