import { FavoriteRepository } from "$/infrastructure/repositories/favorite.repository";
import { useAuth } from "$/pages/authentication/hooks";
import { FavoriteVO, IdObject } from "@eshop/business/domain/value-objects";
import { useEffect, useState } from "react";
import {
  AddProductToCustomerFavoriteUseCase,
  DeleteFavoriteUseCase,
  GetCustomerFavoritesUseCase,
} from "@eshop/business/domain/usecases/customer";
import { ProductRepository } from "$/infrastructure/repositories/product.repository";
import { CustomerRepository } from "$/infrastructure/repositories/user.repository";
import { toast } from "react-toastify";

export const useFavorite = () => {
  const { token, user } = useAuth();
  const [favorites, setFavorites] = useState<Array<FavoriteVO>>([]);
  const customerRepository = new CustomerRepository();
  const productRepository = new ProductRepository();
  const favoriteRepository = new FavoriteRepository({ token });

  const isProductInFavorites = (productId: IdObject) => {
    return favorites.some((f) => f.productId.equals(productId));
  };

  async function add(favorite: FavoriteVO) {
    const useCase = new AddProductToCustomerFavoriteUseCase(
      customerRepository,
      productRepository,
      favoriteRepository
    );

    if (!user) {
      throw new Error("User not found");
    }

    const result = await useCase.execute({
      customerId: user.id.value(),
      productId: favorite.productId.value(),
    });

    if (result.success) {
      toast.success(`${favorite.productName} has been added to your favorites!`);
      setFavorites((prev) => [...prev, favorite]);
    }
  }

  async function remove(productId: IdObject, productName: string) {
    const useCase = new DeleteFavoriteUseCase(
      customerRepository,
      productRepository,
      favoriteRepository
    );

    if (!user) {
      throw new Error("User not found");
    }

    const result = await useCase.execute({
      customerId: user.id.value(),
      productId: productId.value(),
    });

    if (result.success) {
      toast.success(`${productName} has been removed from your favorites!`);
      setFavorites((prev) =>
        prev.filter((f) => !f.productId.equals(productId))
      );
    }
  }

  useEffect(() => {
    if (token) {
      customerRepository.setToken(token);
    }
    // return () => {
    //   customerRepository.clearToken();
    // };
  }, [token, customerRepository]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      const useCase = new GetCustomerFavoritesUseCase(favoriteRepository);

      const result = await useCase.execute({ customerId: user.id.value() });

      setFavorites(result);
    };
    fetchFavorites();
  }, [user?.id.value()]);

  return { favorites, add, remove, isProductInFavorites };
};
