<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipe Suggestions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        h1 {
            text-align: center;
        }
        .recipe {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
        }
        .recipe h2 {
            margin: 0 0 10px;
        }
        .nutrients {
            color: #666;
        }
    </style>
</head>
<body>

<h1>Recipe Suggestions</h1>

<form method="post" action="">
    <label for="ingredients">Enter ingredients (e.g., rice, chicken):</label><br>
    <input type="text" id="ingredients" name="ingredients" required>
    <button type="submit">Get Recipes</button>
</form>

<div id="recipeSuggestions">
    <?php
    const EDAMAM_APP_ID = "96668a25"; // Your Edamam Application ID
    const EDAMAM_APP_KEY = "6b36479652f2a371c3fa2c030af5f7dc"; // Your Edamam Application Key

    function getRecipeSuggestions($ingredients) {
        $url = "https://api.edamam.com/search";
        $params = http_build_query([
            'q' => implode(',', $ingredients),
            'app_id' => EDAMAM_APP_ID,
            'app_key' => EDAMAM_APP_KEY,
            'from' => 0,
            'to' => 5
        ]);

        $requestUrl = "$url?$params";

        // Use file_get_contents or cURL to fetch the API response
        $response = file_get_contents($requestUrl);

        if ($response === FALSE) {
            throw new Exception("Could not fetch recipes");
        }

        // Parse the API response
        $data = json_decode($response, true);
        $recipes = [];

        foreach ($data['hits'] as $hit) {
            $recipe = $hit['recipe'];
            $totalNutrients = $recipe['totalNutrients'];

            // Macronutrients and calorie data
            $totalCalories = $totalNutrients['ENERC_KCAL']['quantity'] ?? 0;
            $carbs = $totalNutrients['CHOCDF']['quantity'] ?? 0;
            $fat = $totalNutrients['FAT']['quantity'] ?? 0;
            $protein = $totalNutrients['PROCNT']['quantity'] ?? 0;
            $fiber = $totalNutrients['FIBTG']['quantity'] ?? 0;

            // Vitamins and minerals (sum them up)
            $vitaminsAndMinerals = array_sum([
                $totalNutrients['VITC']['quantity'] ?? 0,
                $totalNutrients['CA']['quantity'] ?? 0,
                $totalNutrients['FE']['quantity'] ?? 0,
                $totalNutrients['K']['quantity'] ?? 0,
                $totalNutrients['NA']['quantity'] ?? 0
            ]);

            // Macronutrient percentages
            $carbsPercentage = $totalCalories > 0 ? round(($carbs * 4 / $totalCalories * 100), 2) : 0;
            $fatPercentage = $totalCalories > 0 ? round(($fat * 9 / $totalCalories * 100), 2) : 0;
            $proteinPercentage = $totalCalories > 0 ? round(($protein * 4 / $totalCalories * 100), 2) : 0;

            // Balanced diet categories
            $energyGivingPercentage = round($carbsPercentage + $fatPercentage, 2);
            $bodyBuildingPercentage = $proteinPercentage;
            $bodyProtectivePercentage = round(($fiber * 2) + $vitaminsAndMinerals, 2);

            // Store the recipe data
            $recipes[] = [
                'name' => $recipe['label'],
                'description' => $recipe['label'],
                'culturalOrigin' => implode(', ', $recipe['cuisineType']),
                'tags' => implode(', ', $recipe['dishType']),
                'ingredients' => $recipe['ingredientLines'],
                'imageUrl' => $recipe['image'],
                'cookingTime' => $recipe['totalTime'] ? $recipe['totalTime'] . " minutes" : 'N/A',
                'balancedDiet' => [
                    'carbsPercentage' => $carbsPercentage . '%',
                    'fatPercentage' => $fatPercentage . '%',
                    'proteinPercentage' => $proteinPercentage . '%',
                ],
                'totalCalories' => $totalCalories ? $totalCalories . " kcal" : 'N/A',
                'dietCategories' => [
                    'energyGiving' => $energyGivingPercentage . '%',
                    'bodyBuilding' => $bodyBuildingPercentage . '%',
                    'bodyProtective' => $bodyProtectivePercentage . '%',
                ]
            ];
        }

        return $recipes;
    }

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $ingredients = explode(',', $_POST['ingredients']);
        try {
            $recipes = getRecipeSuggestions($ingredients);
            foreach ($recipes as $recipe) {
                echo "<div class='recipe'>";
                echo "<h2>" . htmlspecialchars($recipe['name']) . "</h2>";
                echo "<p><strong>Description:</strong> " . htmlspecialchars($recipe['description']) . "</p>";
                echo "<p><strong>Cooking Time:</strong> " . htmlspecialchars($recipe['cookingTime']) . "</p>";
                echo "<p><strong>Total Calories:</strong> " . htmlspecialchars($recipe['totalCalories']) . "</p>";
                echo "<p class='nutrients'><strong>Carbs:</strong> " . htmlspecialchars($recipe['balancedDiet']['carbsPercentage']) . " | <strong>Fat:</strong> " . htmlspecialchars($recipe['balancedDiet']['fatPercentage']) . " | <strong>Protein:</strong> " . htmlspecialchars($recipe['balancedDiet']['proteinPercentage']) . "</p>";
                echo "<p class='nutrients'><strong>Energy Giving:</strong> " . htmlspecialchars($recipe['dietCategories']['energyGiving']) . " | <strong>Body Building:</strong> " . htmlspecialchars($recipe['dietCategories']['bodyBuilding']) . " | <strong>Body Protective:</strong> " . htmlspecialchars($recipe['dietCategories']['bodyProtective']) . "</p>";
                echo "<img src='" . htmlspecialchars($recipe['imageUrl']) . "' alt='" . htmlspecialchars($recipe['name']) . "' style='width:100%;height:auto;'/>";
                echo "</div>";
            }
        } catch (Exception $e) {
            echo "<p>Error fetching recipes: " . htmlspecialchars($e->getMessage()) . "</p>";
        }
    }
    ?>
</div>

</body>
</html>
