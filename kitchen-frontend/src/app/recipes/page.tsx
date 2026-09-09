interface RecipeIngredients {
  quantityRequired: number;
  ingredient: {
    name: string;
  };
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  recipeIngredients: RecipeIngredients[];
}

async function getRecipes() {
  const response = await fetch('http://localhost:3000/recipes');
  const json = await response.json();
  return json.data as Recipe[]; // tells TS what to expect
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Kitchen Recipe Book</h1>

      <div className="grid gap-6">
        {' '}
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded-lg p-6 shadow-sm bg-white"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              {recipe.name}
            </h2>
            <p className="text-gray-600 mb-4">{recipe.description}</p>

            <h3 className="text-lg font-medium mb-2 border-b pb-1">
              Ingredients:
            </h3>
            <ul className="lest-disc pl-5 space-y-1">
              {recipe.recipeIngredients.map((ri) => (
                <li
                  key={`${recipe.id}-${ri.ingredient.name}`}
                  className="text-gray-700"
                >
                  <span className="font-medium">{ri.ingredient.name}</span> -{' '}
                  {ri.quantityRequired} units
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
