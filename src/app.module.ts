import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventBusModule } from './event-bus/event-bus.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { IConfiguration } from './configuration/interfaces/configuration.interface';
import { IEventBusConnection } from './event-bus/interfaces/event-bus-connection.interface';


@Module({
  imports: [
    ConfigurationModule,
    EventBusModule.forRootAsync({}),
  ],
  controllers: [AppController],
  providers: [
    AppService

  ],
})
export class AppModule {
  constructor(
    private readonly config: IConfiguration,
    @Inject('EVENT_BUS_CONNECTIONS') private readonly connections: IEventBusConnection[]
  ) {
  }

  public async onModuleInit() {
    const cryptoChillRoutes: string[] = this.config.get("crypto-chill.envs");
    for(const envKey of cryptoChillRoutes) {
      //Reinitialize on reconnection
      const useConnection = this.connections[0];
      const queueKey = `crypto-chill-${envKey}`;
      await useConnection.initialize(queueKey, envKey);

      useConnection.onConnectionStarted().subscribe(async () => {
        await useConnection.initialize(queueKey, envKey);
      })
    }
  }
}
