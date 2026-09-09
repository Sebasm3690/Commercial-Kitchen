import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

//@WebSocketGateway -> This is a radio tower!
//cors: { origin: '*' } -> allow walkie-talkies from anywhere to connect to us

@WebSocketGateway({ cors: { origin: '*' } })
export class KitchenGateway implements OnGatewayConnection {
  //This grabs the actual server microphone.
  //Whenever we want to broadcast a message to the whole kitchen.
  //We use this server object to speak.
  @WebSocketServer()
  server: Server;

  //Triggered when a frontend client connects
  //Tuning the Channel: When a new kitchen tablet (the client) connects
  //We check its nametag to see which kitchen it belongs to (kitchenId)
  async handleConnection(@ConnectedSocket() client: Socket) {
    // In a real app, extract this from the JWT handshake
    const kitchenId = client.handshake.query.kitchenId as string;

    if (kitchenId) {
      //Then, client.join(kitchenId) tells that tablet to tune its radio exactly to that specific kitchen's channel.
      client.join(kitchenId);
      console.log(`Client ${client.id} joined kitchen ${kitchenId}`);
    }
  }

  // Called by your Use-Case after a successful DB transaction
  broadcastInventoryUpdate(
    kitchenId: string,
    batchId: string,
    newQuantity: number,
  ) {
    //We tell the big microphone (server) to speak strictly to a specific channel (to(kitchenId))
    //It shouts a message named 'inventory_updated' and hands over a small package of data
    //which ingredient changed, the new amount, and what time it happened.
    this.server.to(kitchenId).emit('inventory_updated', {
      batchId,
      newQuantity,
      timestamp: new Date().toISOString(),
    });
  }
}
