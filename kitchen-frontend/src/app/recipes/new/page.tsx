'use client';

import { useState } from 'react';

export default function NewRecipePage() {
  const [ingredientName, setIngredientName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([
    { ingredientName: '', quantityRequired: 1 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredientRow = () => {
    setIngredients([
      ...ingredients,
      { ingredientName: '', quantityRequired: 1 },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: ingredientName,
      description,
      recipeIngredients: ingredients.map((ingredient) => ({
        ingredientName: ingredient.ingredientName,
        quantityRequired: Number(ingredient.quantityRequired),
      })),
    };

    try {
      const response = await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIngredientName('');
        setDescription('');
        setIngredients([{ ingredientName: '', quantityRequired: 0 }]);
      } else {
        const errorData = await response.json();
        alert('Validation Error: ' + JSON.stringify(errorData.message));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateIngredients = async (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create new Recipe</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 border rounded-lg shadow-sm"
      >
        {/* Main Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipe Name
          </label>
          <input
            type="text"
            required
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            placeholder="e.g., Llapingachos"
            className="w-full border p-2 rounded text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A delicious dish"
            className="w-full border p-2 rounded text-gray-900 h-24"
          />
        </div>
        {/* Dynamic Ingredients Section */}
        <div>
          <h3 className="block text-sm font-medium mb-1 text-gray-700">
            Ingredients
          </h3>
          {ingredients.map((ingredient, index) => (
            <div className="flex space-x-3">
              <input
                type="text"
                required
                value={ingredient.ingredientName}
                onChange={(e) =>
                  updateIngredients(index, 'ingredientName', e.target.value)
                }
                placeholder="Ingredient (e.g., Potatoes)"
                className="flex-1 border p-2 rounded text-gray-800"
              />
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={ingredient.quantityRequired}
                onChange={(e) =>
                  updateIngredients(index, 'quantityRequired', e.target.value)
                }
                className="w-24 border p-2 rounded text-gray-800"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredientRow}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
          >
            + Add another ingredient
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Saved...' : 'Save Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}
