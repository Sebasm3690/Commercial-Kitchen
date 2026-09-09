'use client';

import { useState, useEffect } from 'react';
import { useInventorySocket } from '../hooks/useInventorySocket';

interface InventoryBatch {
  id: string;
  ingredientName: string;
  currentQuantity: number;
  unit: string;
}

export default function Home() {
  // 1. Initialize the hook (hardcoding 'kitchen_1' for now)
  const { inventory, loading, optimisticDeduct, addBatchLocally } =
    useInventorySocket('kitchen_1');

  /*const [loading, setLoading] = useState(true);
  const [inventories, setInventories] = useState<InventoryBatch[]>([]);*/

  // New state for the form inputs
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/Inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientName: newName,
          currentQuantity: parseInt(newQuantity, 10),
        }),
      });

      const json = await response.json();

      // Update the real-time list via the hook's helper function
      addBatchLocally(json.data);

      setNewName('');
      setNewQuantity('');
    } catch (error) {
      console.error('Failed to add inventory', error);
    }
  };

  /*useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:3000/Inventory');
        const json = await response.json();
        setInventories(json.data);
      } catch (error) {
        console.error('Failed to fetch inventory', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);*/

  /*const handleDeduct = async (id: string) => {
    try {
      const response = await fetch('http://localhost:3000/Inventory/deduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, amount: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to deduct: ${errorData.message}`);
        return;
      }

      setInventories((prevInventories) =>
        prevInventories.map((inventory) =>
          inventory.id === id
            ? { ...inventory, currentQuantity: inventory.currentQuantity - 1 }
            : inventory,
        ),
      );
    } catch (error) {
      console.error('Network error while deducting:', error);
      alert('Network error. Please try again.');
    }
  };*/

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {' '}
          Kitchen Inventory Batches{' '}
        </h1>
        {/* New Ingredient Form */}
        <form
          onSubmit={handleCreateInventory}
          className="bg-white p-6 rounded-lg shadow mb-8 flex gap-4 items-end"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Ingredients
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900"
              placeholder="e.g Chicken Tenders"
              required
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Quantity
            </label>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="w-full border border-gray-300 roundend-md p-2 text-gray-900"
              placeholder="e.g 100"
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 border rounded text-white font-medium p-2"
          >
            Add batch
          </button>
        </form>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading batches...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">
                    Ingredient
                  </th>
                  <th className="p-4 font-semibold text-gray-700">
                    Quantity Remaining
                  </th>
                  <th className="p-4 font-semibold text-gray-700">Batch ID</th>
                  <th className="p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-100 hover:bg-50"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {inv.ingredientName}
                    </td>
                    <td className="p-4 text-gray-700">
                      <span
                        className={` ${
                          inv.currentQuantity < 5
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {inv.currentQuantity}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm font-mono">
                      {inv.id}
                    </td>
                    <td className="p-4">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medimum py-1 px-3"
                        //2. Fire the optimistic deduction from the hook!
                        onClick={() => optimisticDeduct(inv.id, 1)}
                      >
                        Deduct 1
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {inventory.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No inventory batches found
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
