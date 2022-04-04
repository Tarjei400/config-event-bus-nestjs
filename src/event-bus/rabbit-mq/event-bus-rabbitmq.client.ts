// import * as RabbitMQ from 'amqplib';
// import { Channel, Connection, ConsumeMessage, Message } from 'amqplib';
// import { DEAD_LETTER_EXCHANGE_NAME, DEAD_LETTER_QUEUE_NAME } from './consts';
// import { MessageDto } from '../dto/message.dto';
//
// // create the consumer using existing connection and start the consumption
//
// export class EventBusRabbitmqClient {
//
//   private connection: Connection;
//   private channel: Channel;
//   private routingKeys: string[];
//
//   private isRetrying: boolean;
//
//   constructor(
//     private readonly exchange: string,
//     private readonly queue: string,
//   ) {
//   }
//
//   async connect() {
//     try {
//
//       this.connection = await RabbitMQ.connect(
//         'amqp://user:bitnami@localhost:5672/',
//       );
//
//       this.connection.on('error', (e) => console.error(e));
//       this.connection.on('close', (e) => this.retryConnection());
//
//       this.channel = await this.connection.createChannel();
//       console.log('Connected to rabbitmq');
//     } catch (e) {
//       await this.retryConnection();
//     }
//
//   }
//
//   async retryConnection() {
//
//     console.log('Retrying connection...', this.routingKeys);
//     return new Promise((resolve: any, reject) => {
//       setTimeout(async () => {
//         await this.init(this.routingKeys);
//         resolve();
//
//       }, 10000);
//     });
//   }
//
//   async init(routingKeys: string[]) {
//     this.routingKeys = routingKeys;
//     try {
//       await this.connect();
//
//       //Define dead letter exchange
//       const dlx = await this.channel.assertExchange(DEAD_LETTER_EXCHANGE_NAME, 'fanout', {
//         durable: true,
//       });
//
//
//       const dlq = await this.channel.assertQueue(DEAD_LETTER_QUEUE_NAME, {
//         autoDelete: false,
//         arguments: {
//           'x-message-ttl': 1000*30,
//         }
//       });
//       await this.channel.bindQueue(dlq.queue, dlx.exchange, "*");
//
//
//       //Create exchange and queue for a our messages
//       const ex = await this.channel.assertExchange(this.exchange, 'direct', {
//         durable: true,
//       });
//
//       const q = await this.channel.assertQueue(this.queue, {
//         // deadLetterRoutingKey: `route.to.${this.queue}`,
//         deadLetterExchange: dlx.exchange,
//         autoDelete: false,
//
//       });
//
//       const binds = routingKeys.map(async (routingKey) => {
//         await this.channel.bindQueue(q.queue, this.exchange, routingKey);
//
//       });
//
//       await Promise.all(binds);
//
//     } catch (e) {
//       console.error(e);
//     }
//
//   }
//
//   async receive(cb: (msg: MessageDto) => void, queue?: string) {
//     try {
//       await this.channel.consume(this.queue, (msg: Message) => {
//         const headers = msg?.properties?.headers;
//         const death = headers && headers['x-death'];
//         try {
//           if (death && Array.isArray(death) && death[0]?.count > 4) {
//             console.error("Message could not be consumed, acknowleging");
//
//             this.channel.sendToQueue(`errors.unhandled`, Buffer.from(msg.content.toString()));
//
//               return;
//           }
//           const jsonData = JSON.parse(msg.content.toString());

//
//           this.channel.ack(msg);
//         } catch (e) {
//           console.error("Couldnt parse message")
//
//           this.channel.reject(msg, false);
//
//         }
//
//       });
//     } catch (e) {
//       console.log("connection lost...")
//       //await this.retryConnection();
//     }
//
//   }
//
//   send(payload: string, routingKey: any): void {
//     this.channel.publish(this.exchange, routingKey, Buffer.from(payload));
//   }
//
// }
