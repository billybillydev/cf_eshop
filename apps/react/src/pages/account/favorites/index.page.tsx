import {
  EmptyFavorites,
  FavoriteItem,
} from "$/pages/account/favorites/components";
import { useFavorite } from "$/pages/account/favorites/favorite.hooks";
import { Dat } from "@mosidev/dat";

export function AccountFavoritesPage() {
  const { favorites, remove } = useFavorite();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Favorites</h2>
        <p className="text-sm text-muted-foreground">
          Products you've saved for later.
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <ul className="space-y-3">
          {[...favorites]
            .sort((a, b) =>
              new Dat(a.createdAt).isAfter(new Dat(b.createdAt)) ? -1 : 1
            )
            .map((favorite) => (
              <FavoriteItem
                key={favorite.productId.value()}
                favorite={favorite}
                onRemove={() =>
                  remove(favorite.productId, favorite.productName)
                }
              />
            ))}
        </ul>
      )}
    </div>
  );
}
