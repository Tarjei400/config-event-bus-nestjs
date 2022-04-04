export const SUBSCRIBER_METADATA_KEY = "EventBus.subscribe.metadata"


export enum EventBusDriver {
  RABBITMQ = 'rabbitmq',
  SQS      = 'sqs',
  MEMORY   = 'memory',
}

export const EventBusConfig = {
  RabbitMQConnections: "rabbitmq.connections",
  Driver: "event-bus.driver",
  Connections: "event-bus.connections",
}

