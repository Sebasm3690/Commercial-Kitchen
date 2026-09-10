import { Module } from '@nestjs/common';
import { KitchenGateway } from './gateways/kitchen.gateway';

@Module({
  providers: [KitchenGateway],
  exports: [KitchenGateway],
})
export class EventsModule {}
