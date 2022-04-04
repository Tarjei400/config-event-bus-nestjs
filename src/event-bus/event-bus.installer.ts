import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { SUBSCRIBER_METADATA_KEY } from './consts';
import { Inject, Injectable } from '@nestjs/common';
import { IEventBusConnection } from './interfaces/event-bus-connection.interface';

@Injectable()
export class EventBusInstaller {
  constructor(
    private readonly discover: DiscoveryService,
    @Inject('EVENT_BUS_CONNECTIONS') private readonly connections: IEventBusConnection[]
  ) {}

  public async install() {
    const providers: any[] = await this.discover.providerMethodsWithMetaAtKey(SUBSCRIBER_METADATA_KEY);
    console.log("Test Providers found", providers.length)
    for (const provider of providers) {
      const {details, targetClass, targetName, methodName, callback } = provider.meta;
      const { topic, queue, connection, autoAck} = details;
      const foundConnection = this.connections.find((conn: IEventBusConnection) => conn.getName() === connection)
      const useConnection = foundConnection ?? this.connections[0];

      await useConnection.initialize(queue, topic);
      await useConnection.receive(callback, queue, autoAck);

      //Reinitialize on reconnection
      useConnection.onConnectionStarted().subscribe(async () => {
        await useConnection.initialize(queue, topic);
        await useConnection.receive(callback, queue, autoAck);
      })
    }
  }
}
