import 'source-map-support/register';
import { SQSEvent, SQSHandler, SQSRecord } from 'aws-lambda';
import * as logger from '../helpers/logger';
// import { broadcast } from '../services/socket';

interface EventItem {
  itemId: string,
  cnt: number,
  shelfId: string,
  lineId: string;
}
interface StoreEvent {
  action: 'ACCEPTANCE' | 'DISPENSE' | 'MOVEMENT';
  parentId: string;
  items: EventItem[];
}

interface MessagePayload {
  userId: string;
  organizationId: string;
  event: StoreEvent;
}

export const handler: SQSHandler = async (event: SQSEvent) => {
  logger.debug('MessageHandle', { event });
  await Promise.all(event.Records.map((record: SQSRecord) => {
    const { body: bodyJson } = record;
    const body: MessagePayload = JSON.parse(bodyJson);
    // return broadcast(body);
  }));
  return;
};
