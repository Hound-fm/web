import { Heart } from "lucide-react";
import useFavorite from "hooks/useFavorite";
import Button from "component/button";
export default function FavoriteButton({ id, favoriteType, className }) {
  const { isFavorite, toggleFavorite } = useFavorite(id, favoriteType);
  return (
    <Button
      icon={Heart}
      onClick={toggleFavorite}
      className={className}
      aria-pressed={isFavorite ? true : false}
    />
  );
}
