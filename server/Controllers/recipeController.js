const axios = require('axios');
const Recipe = require('../Models/Recipe'); // Adjust the path as needed

const EDAMAM_APP_ID = "96668a25"; // Your Edamam Application ID
const EDAMAM_APP_KEY = "6b36479652f2a371c3fa2c030af5f7dc"; // Your Edamam Application Key
const getRecipeSuggestions = async(ingredients) => {
    const url = "https://api.edamam.com/search";
    const params = {
        q: ingredients.join(','),
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        from: 0,
        to: 15,
    };

    try {
        const response = await axios.get(url, { params });

        return response.data.hits.map(hit => {
            const recipe = hit.recipe;

            // Extract macronutrient data
            const totalNutrients = recipe.totalNutrients;
            const totalCalories = totalNutrients.ENERC_KCAL.quantity || 0;
            const carbs = totalNutrients.CHOCDF.quantity || 0;
            const fat = totalNutrients.FAT.quantity || 0;
            const protein = totalNutrients.PROCNT.quantity || 0;
            const fiber = totalNutrients.FIBTG.quantity || 0;
            const vitaminsAndMinerals = [
                totalNutrients.VITC.quantity || 0,
                totalNutrients.CA.quantity || 0,
                totalNutrients.FE.quantity || 0,
                totalNutrients.K.quantity || 0,
                totalNutrients.NA.quantity || 0
            ].reduce((a, b) => a + b, 0); // Summing up vitamins and minerals

            // Calculate macronutrient percentages
            const carbsPercentage = ((carbs * 4) / totalCalories * 100).toFixed(2); // 1g carbs = 4 kcal
            const fatPercentage = ((fat * 9) / totalCalories * 100).toFixed(2); // 1g fat = 9 kcal
            const proteinPercentage = ((protein * 4) / totalCalories * 100).toFixed(2); // 1g protein = 4 kcal

            // Balanced Diet Categories
            const energyGivingPercentage = (parseFloat(carbsPercentage) + parseFloat(fatPercentage)).toFixed(2); // Carbs + Fats
            const bodyBuildingPercentage = proteinPercentage; // Protein
            const bodyProtectivePercentage = ((fiber * 2) + vitaminsAndMinerals).toFixed(2); // Fiber and vitamins/minerals

            return {
                name: recipe.label,
                description: recipe.label,
                culturalOrigin: recipe.cuisineType.join(', '),
                tags: recipe.dishType.join(', '),
                ingredients: recipe.ingredientLines,
                imageUrl: recipe.image,
                cookingTime: recipe.totalTime ? `${recipe.totalTime} minutes` : 'N/A',
                balancedDiet: {
                    carbsPercentage: `${carbsPercentage}%`,
                    fatPercentage: `${fatPercentage}%`,
                    proteinPercentage: `${proteinPercentage}%`,
                },
                totalCalories: totalCalories ? `${totalCalories.toFixed(2)} kcal` : 'N/A',
                dietCategories: {
                    energyGiving: `${energyGivingPercentage}%`,
                    bodyBuilding: `${bodyBuildingPercentage}%`,
                    bodyProtective: `${bodyProtectivePercentage}%`
                }
            };
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw new Error("Could not fetch recipes");
    }
};

const saveRecipes = async(recipes) => {
    const promises = recipes.map(recipe => Recipe.create(recipe));
    await Promise.all(promises);
};

const fetchAndSaveRecipes = async(req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "No valid ingredients provided." });
    }

    try {
        const recipeSuggestions = await getRecipeSuggestions(ingredients);
        await saveRecipes(recipeSuggestions);
        return res.status(200).json(recipeSuggestions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllRecipes = async(req, res) => {
    // Define static ingredients here
    const staticIngredients = ["chicken", "rice"]; // Example static ingredients

    const url = "https://api.edamam.com/search";
    const params = {
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        from: 0,
        to: 100, // Retrieve up to 100 recipes
        q: staticIngredients.join(','), // Join the static ingredients to form a query
    };

    try {
        const response = await axios.get(url, { params });

        const recipes = response.data.hits.map(hit => {
            const recipe = hit.recipe;

            // Extract macronutrient data
            const totalNutrients = recipe.totalNutrients || {};
            const totalCalories = totalNutrients.ENERC_KCAL ? totalNutrients.ENERC_KCAL.quantity : 0;
            const carbs = totalNutrients.CHOCDF ? totalNutrients.CHOCDF.quantity : 0;
            const fat = totalNutrients.FAT ? totalNutrients.FAT.quantity : 0;
            const protein = totalNutrients.PROCNT ? totalNutrients.PROCNT.quantity : 0;
            const fiber = totalNutrients.FIBTG ? totalNutrients.FIBTG.quantity : 0;
            const vitaminsAndMinerals = [
                totalNutrients.VITC ? totalNutrients.VITC.quantity : 0,
                totalNutrients.CA ? totalNutrients.CA.quantity : 0,
                totalNutrients.FE ? totalNutrients.FE.quantity : 0,
                totalNutrients.K ? totalNutrients.K.quantity : 0,
                totalNutrients.NA ? totalNutrients.NA.quantity : 0
            ].reduce((a, b) => a + b, 0); // Summing up vitamins and minerals

            // Calculate macronutrient percentages
            const carbsPercentage = ((carbs * 4) / totalCalories * 100).toFixed(2); // 1g carbs = 4 kcal
            const fatPercentage = ((fat * 9) / totalCalories * 100).toFixed(2); // 1g fat = 9 kcal
            const proteinPercentage = ((protein * 4) / totalCalories * 100).toFixed(2); // 1g protein = 4 kcal

            // Balanced Diet Categories
            const energyGivingPercentage = (parseFloat(carbsPercentage) + parseFloat(fatPercentage)).toFixed(2); // Carbs + Fats
            const bodyBuildingPercentage = proteinPercentage; // Protein
            const bodyProtectivePercentage = ((fiber * 2) + vitaminsAndMinerals).toFixed(2); // Fiber and vitamins/minerals

            return {
                name: recipe.label,
                description: recipe.label,
                culturalOrigin: recipe.cuisineType.join(', '),
                tags: recipe.dishType.join(', '),
                ingredients: recipe.ingredientLines,
                imageUrl: recipe.image,
                cookingTime: recipe.totalTime ? `${recipe.totalTime} minutes` : 'N/A',
                totalCalories: totalCalories ? `${totalCalories.toFixed(2)} kcal` : 'N/A',
                balancedDiet: {
                    carbsPercentage: `${carbsPercentage}%`,
                    fatPercentage: `${fatPercentage}%`,
                    proteinPercentage: `${proteinPercentage}%`,
                },
                dietCategories: {
                    energyGiving: `${energyGivingPercentage}%`,
                    bodyBuilding: `${bodyBuildingPercentage}%`,
                    bodyProtective: `${bodyProtectivePercentage}%`
                }
            };
        });

        return res.status(200).json(recipes); // Return recipes as JSON
    } catch (error) {
        console.error("Error fetching all recipes:", error);
        return res.status(500).json({ error: "Could not fetch recipes" });
    }
};


module.exports = {
    fetchAndSaveRecipes,
    getAllRecipes,

};