import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchWeeklyPlan, addRecipeToWeeklyPlan, removeRecipeFromWeeklyPlan } from '../Services/authService';
import { Recipe } from '../types/index';

// Define a type for a meal entry
export interface MealEntry {
    recipe: Recipe;
    reminderEnabled?: boolean;
    reminderTime?: string;
}

export interface DayPlan {
    Breakfast?: MealEntry;
    Lunch?: MealEntry;
    Dinner?: MealEntry;
}

// Define a type for the whole weekly plan
export interface WeeklyPlanData {
    [key: string]: DayPlan;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner'] as const;

interface RecipeContextType {
    selectedRecipe: Recipe | null;
    setSelectedRecipe: (recipe: Recipe | null) => void;
    weeklyPlan: WeeklyPlanData;
    setWeeklyPlan: (plan: WeeklyPlanData) => void;
    setMealPlanTarget: (day: string, mealType: string) => void;
    addRecipeToPlan: (day: string, mealType: string, recipe: Recipe) => Promise<void>;
    removeRecipeFromPlan: (day: string, mealType: string) => Promise<void>;
    loadWeeklyPlan: () => Promise<void>;
    mealPlanTargetDay: string | null;
    mealPlanTargetMealType: string | null;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanData>({});
    const [mealPlanTarget, setMealPlanTarget] = useState<{ day: string; mealType: string } | null>(null);

    const loadWeeklyPlan = useCallback(async () => {
        try {
            const data = await fetchWeeklyPlan();
            setWeeklyPlan(data);
        } catch (error) {
            console.error('Error loading weekly plan:', error);
            throw error;
        }
    }, []);

    const addRecipeToPlan = useCallback(async (day: string, mealType: string, recipe: Recipe) => {
        try {
            await addRecipeToWeeklyPlan({
                day,
                mealType,
                recipeId: Number(recipe.id),
            });
            await loadWeeklyPlan(); // Reload the plan after adding
        } catch (error) {
            console.error('Error adding recipe to plan:', error);
            throw error;
        }
    }, [loadWeeklyPlan]);

    const removeRecipeFromPlan = useCallback(async (day: string, mealType: string) => {
        try {
            await removeRecipeFromWeeklyPlan({
                day,
                mealType,
            });
            await loadWeeklyPlan(); // Reload the plan after removal
        } catch (error) {
            console.error('Error removing recipe from plan:', error);
            throw error;
        }
    }, [loadWeeklyPlan]);

    const value = {
        selectedRecipe,
        setSelectedRecipe,
        weeklyPlan,
        setWeeklyPlan,
        setMealPlanTarget: (day: string, mealType: string) => setMealPlanTarget({ day, mealType }),
        addRecipeToPlan,
        removeRecipeFromPlan,
        loadWeeklyPlan,
        mealPlanTargetDay: mealPlanTarget?.day || null,
        mealPlanTargetMealType: mealPlanTarget?.mealType || null,
    };

    return (
        <RecipeContext.Provider value={value}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipe = () => {
    const context = useContext(RecipeContext);
    if (context === undefined) {
        throw new Error('useRecipe must be used within a RecipeProvider');
    }
    return context;
}; 