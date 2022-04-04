import { Inject, Injectable } from '@nestjs/common';
import { Subscribe } from './event-bus/decorators/subscribe.decorator';
import { IEventBusConnection } from './event-bus/interfaces/event-bus-connection.interface';
import { MessageDto } from './event-bus/dto/message.dto';


@Injectable()
export class AppService {


  constructor(
    @Inject('EVENT_BUS_CONNECTIONS') private readonly conns: IEventBusConnection[]

  ){
    // this.env1 = new EventBusRabbitmqClient('callbacks.cryptochill', 'cryptochill-callbacks-env1')
    // this.env2 = new EventBusRabbitmqClient('callbacks.cryptochill', 'cryptochill-callbacks-env2')
    // this.env3 = new EventBusRabbitmqClient('callbacks.cryptochill', 'cryptochill-callbacks-env3')
  }


  async load() {
    // await this.env1.init(['env1']);
    // await this.env2.init(['env2']);
    // await this.env3.init(['env2']);

    // this.env1.receive(this.capturePaymentEnv1.bind(this));
    // this.env2.receive(this.capturePaymentEnv2.bind(this));
    // this.env3.receive(this.capturePaymentEnv3.bind(this));

  }

  @Subscribe({
    topic: "DEV-1",
    queue: "crypto-chill-DEV1",
    autoAck: true,
  })
  public async capturePaymentEnv1(msg: MessageDto) {
    console.log(`DEV-1 Received message: ${JSON.stringify(msg)}`);
  }


  @Subscribe({
    topic: "DEV-2",
    queue: "crypto-chill-DEV2",
    autoAck: true,
  })
  public async capturePaymentEnv2(msg: MessageDto) {
    console.log(`DEV-2 Received message: ${JSON.stringify(msg)}`);
  }

  @Subscribe({
    topic: "DEV-3",
    queue: "crypto-chill-DEV3",
    autoAck: false,
  })
  public async capturePaymentEnv3(msg: MessageDto) {
    console.log(`DEV-3 Received message: ${JSON.stringify(msg)}`);
  }

  @Subscribe({
    topic: "PLUTONIUM-4",
    queue: "crypto-chill-PLUTONIUM-4",
    autoAck: false,
  })
  public async capturePaymentEn4(msg: MessageDto) {
    console.log(`PLUTONIUM-4 Received message: ${JSON.stringify(msg)}`);
    msg.ack();
  }

  putCallbackDataToQueue(payload: any, routingKey: string): void {
    this.conns[0].send(payload, routingKey)
  }
}
