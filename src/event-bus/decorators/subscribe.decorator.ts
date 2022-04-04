import { SetMetadata } from '@nestjs/common';
import { SUBSCRIBER_METADATA_KEY } from '../consts';


/***
 * WARNING! Different drivers might use different fields from this object,
 */
class SubscriptionDetails {
  topic?: string;
  queue?: string;
  connection?: string;
  autoAck?: boolean;
}

class EventBusSubscriptionMetadata {
  details: SubscriptionDetails;
  targetClass: string;
  targetName: string;
  methodName: string;
  callback: (message: any) => void;
}

export const Subscribe = (details: SubscriptionDetails) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata<string, EventBusSubscriptionMetadata>(
      SUBSCRIBER_METADATA_KEY,
      {
        details,
        targetClass: target.constructor,
        targetName: target.constructor.name,
        methodName: propertyKey,
        callback: descriptor.value,
      },
    )(target, propertyKey, descriptor);
  };
};

