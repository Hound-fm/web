import { Heart } from "lucide-react";
import { memo } from "react";
import useFavorite from "hooks/useFavorite";
import Button from "component/button";

function FavoriteButton({ id, favoriteType, className }) {
  const { isFavorite, toggleFavorite } = useFavorite(id, favoriteType);
  const handleClick = () => {
    toggleFavorite();
  };

  return (
    <Button
      icon={Heart}
      onClick={handleClick}
      className={className}
      aria-pressed={isFavorite ? true : false}
    />
  );
}

export default memo(FavoriteButton);
