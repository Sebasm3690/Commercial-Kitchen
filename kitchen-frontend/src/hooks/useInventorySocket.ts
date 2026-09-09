import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

//useState is the tablet's notepad. It remembers what is currently in the fridge.
//useRef is a tight grip on the walkie-talkie. It keeps the radio turned on without accidentally putting it down when the screen changes.

export interface InventoryBatch {
  id: string;
  ingredientName: string;
  currentQuantity: number;
  unit: string;
}

export const useInventorySocket = (kitchenId: string) => {
  const [inventory, setInventory] = useState<InventoryBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  // 1. Centralized Fetch Logic
  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:3000/Inventory');
      const json = await response.json();
      setInventory(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //useEffect runs exactly once when the tablet turns on
  useEffect(() => {
    // Fetch initial data on mount
    fetchInventory();

    //Establish WebSocket Connection
    //It basically knocks on the NestJS door and says,
    //"Hello, I am a standard HTTP request, but I would like to upgrade our connection to a permanent WebSocket."
    socketRef.current = io('http://localhost:3000', {
      query: { kitchenId }, //io(...) literally turns the walkie-talkie on and tells the server, "Hi, I am in this specific kitchen!"
    });

    //Listening for Shouts: .on(...) means the tablet is actively listening to the radio
    //If it hears the 'inventory_updated' shout, it immediately updates its notepad.
    //finds the exact ingredient that changed, and erases the old number to write the new one.

    // Listen for broadcasts from NestJS
    // The .on doesn't run automatically when the code starts. We have to wait for the server to send the specific message
    // ('inventory_updated) is not a keyword
    socketRef.current.on('inventory_updated', (payload: any) => {
      setInventory((prev) =>
        prev.map((batch) =>
          batch.id === payload.batchId
            ? { ...batch, currentQuantity: payload.newQuantity }
            : batch,
        ),
      );
    });

    // Resync Protocol: Overwrite stale data after network drop
    // ('reconnect') is a keyword (like 'connect', 'disconnect', and 'reconnect')
    socketRef.current.on('reconnect', () => {
      fetchInventory();
    });

    //This code only executes when you completely close the browser tab
    return () => {
      socketRef.current?.disconnect();
    };
  }, [kitchenId]);

  //When the chef taps "Use 1 Potato", we don't wait for the server to say "Okay." We erase the potato on our notepad instantly
  const optimisticDeduct = async (batchId: string, amount: number) => {
    setInventory((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? { ...b, currentQuantity: b.currentQuantity - amount }
          : b,
      ),
    );

    try {
      const response = await fetch('http://localhost:3000/Inventory/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: batchId, amount }), // Matched your backend 'id' payload
      });
      if (!response.ok) throw new Error('Deduction failed');
    } catch (error) {
      fetchInventory(); // Re-sync if network fails
    }
  };

  const addBatchLocally = (newBatch: InventoryBatch) => {
    setInventory((prev) => [...prev, newBatch]);
  };

  return { inventory, loading, optimisticDeduct, addBatchLocally };
};
