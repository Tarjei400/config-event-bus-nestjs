import * as RabbitMQ from 'amqplib';
import { Channel, Connection, Message, Options } from 'amqplib';
import { Observable, Subject, Subscription } from 'rxjs';
import { IEventBusConnection } from '../interfaces/event-bus-connection.interface';
import { NoClientConfigurationException } from '../exceptions/no-client-configuration-exception';
import { DEAD_LETTER_EXCHANGE_NAME, DEAD_LETTER_QUEUE_NAME } from './consts';


export class RabbitmqConnection implements IEventBusConnection {
  private connection: Connection;
  private channel: Channel;

  private $connectionStarted = new Subject<boolean>();

  private connectionDetails: Options.Connect;

  constructor(
    public readonly name: string,
    private readonly exchange: string,
  ) {

  }

  getName(): string {
    return this.name;
  }
  async connect(config: Options.Connect) {
    this.connectionDetails = config;

    if(!this.connectionDetails) {
      throw new NoClientConfigurationException();
    }
    try {

      this.connection = await RabbitMQ.connect(this.connectionDetails);

      this.connection.on('error', (e) => console.error(e));
      this.connection.on('close', (e) => this.reconnect());

      this.channel = await this.connection.createChannel();
      this.$connectionStarted.next(true);

      console.log('Connected to rabbitmq');
    } catch (e) {
      await this.retryConnection();
    }
  }

  async initialize( queue: string, topic: string) {
      try {

        //Define dead letter exchange
        const dlx = await this.channel.assertExchange(DEAD_LETTER_EXCHANGE_NAME, 'fanout', {
          durable: true,
        });

        const dlq = await this.channel.assertQueue(DEAD_LETTER_QUEUE_NAME, {
          autoDelete: false,
          arguments: {
            'x-message-ttl': 1000*30,
          }
        });

        await this.channel.bindQueue(dlq.queue, dlx.exchange, "*");


        //Create exchange and queue for a our messages
        const ex = await this.channel.assertExchange(this.exchange, 'direct', {
          durable: true,
        });

        const q = await this.channel.assertQueue(queue, {
          // deadLetterRoutingKey: `route.to.${this.queue}`,
          deadLetterExchange: dlx.exchange,
          autoDelete: false,

        });

        await this.channel.bindQueue(q.queue, this.exchange, topic);


      } catch (e) {
        console.error(e);
      }

  }
  async reconnect() {
    return this.connect(this.connectionDetails);
  }

  async retryConnection() {
    console.log('Retrying rabbitmq connection...');

    return new Promise((resolve: any, reject) => {
      setTimeout(async () => {
        await this.reconnect();
        resolve();

      }, 10000);
    });
  }

  onConnectionStarted() {
    return this.$connectionStarted;
  }

  /***
   * Consumer method definition, initialized consuming from a channel from given queue
   * It needs to be recalled in case of connection dies, hence ints in sepearte method.
   */
  async receive(cb: any, queue: string, autoAck: boolean = true) {
    try {
      await this.channel.consume(queue, (msg: Message) => {
        const headers = msg?.properties?.headers;
        const death = headers && headers['x-death'];
        try {
          if (death && Array.isArray(death) && death[0]?.count > 4) {
            console.error("Message could not be consumed, acknowleging");

            this.channel.sendToQueue(`errors.unhandled`, Buffer.from(msg.content.toString()));

            return;
          }
          const jsonData = JSON.parse(msg.content.toString());
          const msgDto= {
            payload: jsonData,
            ack: async () => {
              await this.channel.ack(msg)
            },
            nack: async () => {
              await this.channel.nack(msg)
            }
          };

          cb(msgDto);
          if(autoAck) {
            this.channel.ack(msg);
          }
        } catch (e) {
          console.error("Couldnt parse message")

          this.channel.reject(msg, false);

        }

      });
    } catch (e) {
      console.log("connection lost...")
      //await this.retryConnection();
    }
  }

  send(payload: string, topic?: string): void {
    this.channel.publish(this.exchange, topic, Buffer.from(JSON.stringify(payload)));
  }

}
