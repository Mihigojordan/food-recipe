// /src/api/api.ts
export const fetchBanners = async () => {
  const response = await fetch('http://192.168.127.80:3000/api/banners');
  const data = await response.json();
  return data;
};

export const fetchCategories = async () => {
  const response = await fetch('http://192.168.1.73:3000/api/categories');
  const data = await response.json();
  return data;
};

export const fetchRecipes = async (searchType: any) => {
  const response = await fetch('http://192.168.1.73:3000/api/recipes');
  const data = await response.json();
  return data;
};
