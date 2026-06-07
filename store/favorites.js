import { create } from 'zustand';

export const useFavoriteStore = create((set) => ({
  favorites: [],
  toggleFavorite: (item) =>
    set((state) => {
      const exists = state.favorites.some((fav) => fav.id === item.id);
      if (exists) {
        return {
          favorites: state.favorites.filter((fav) => fav.id !== item.id),
        };
      } else {
        return { favorites: [...state.favorites, item] };
      }
    }),
}));
