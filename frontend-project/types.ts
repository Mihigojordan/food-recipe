export interface Recipe {
    id: number;
    name: string;
    imageUrl: string;
    cookingTime: string;
    culturalOrigin: string;
    ingredients: string[];
    instructions: string[];
    userId?: number;
    description?: string;
    balancedDiet?: {
        carbsPercentage: string;
        proteinPercentage: string;
        fatPercentage: string;
    };
    totalCalories?: number;
}

export interface UserData {
    id: number;
    username: string;
    email: string;
    profileImage?: string;
}

export interface AuthResponse {
    token: string;
    user: UserData;
}
