export interface Recipe {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    culturalOrigin: string;
    tags: string;
    cookingTime: string;
    ingredients: string[];
    balancedDiet: {
        carbsPercentage: string;
        fatPercentage: string;
        proteinPercentage: string;
    };
    totalCalories: string;
    dietCategories: {
        energyGiving: string;
        bodyBuilding: string;
        bodyProtective: string;
    };
    image: string;
}

export interface UserData {
    email: string;
    username?: string;
    profileImage?: string;
    recipesCount?: number;
    favoritesCount?: number;
    reviewsCount?: number;
    preferences?: string[];
    // Add other user data fields as needed
}

export interface AuthResponse {
    token?: string;
    user?: UserData;
    // Add other response fields as needed
} 