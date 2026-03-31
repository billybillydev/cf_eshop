"use client";

import { CartRepository } from "$infrastructure/repositories/cart.repository";
import {
  CartEntity,
  CartItemEntity,
  CartItemProductEntity
} from "@eshop/business/domain/entities";
import {
  AddToCartUseCase,
  DeleteItemFormCartUseCase,
  GetCartItemByProductIdUseCase,
  GetCartUseCase,
  UpdateItemQuantityInCartUseCase,
} from "@eshop/business/domain/usecases/cart";
import { IdObject } from "@eshop/business/domain/value-objects";
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

type CartContextProps = {
  cart: CartEntity;
  addToCart(product: CartItemProductEntity): Promise<void>;
  deleteItemFromCart(product: CartItemProductEntity): Promise<void>;
  getCartItemByProductId(productId: IdObject): Promise<CartItemEntity | null>;
  updateItemQuantityInCart(
    product: { id: IdObject; name: string },
    quantity: number
  ): Promise<void>;
};

export const CartContext = createContext<CartContextProps>({
  cart: new CartEntity(),
  addToCart: async () => {},
  deleteItemFromCart: async () => {},
  getCartItemByProductId: async () => Promise.resolve(null),
  updateItemQuantityInCart: async () => {},
});

export const CartContextProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState<CartEntity>(new CartEntity());

  const cartRepository = new CartRepository();

  async function addToCart(product: CartItemProductEntity) {
    const addToCartUseCase = new AddToCartUseCase(cartRepository);
    const updatedCart = await addToCartUseCase.execute(product);
    setCart(updatedCart);

    toast.success(`${product.name} has been added to the cart !`);
  }

  async function deleteItemFromCart(product: CartItemProductEntity) {
    const deleteItemFromCartUseCase = new DeleteItemFormCartUseCase(
      cartRepository
    );
    const updatedCart = await deleteItemFromCartUseCase.execute(product.id);
    setCart(updatedCart);

    toast.success(`${product.name} has been removed from the cart!`);
  }

  async function getCartItemByProductId(
    productId: IdObject
  ): Promise<CartItemEntity | null> {
    const getCartItemByProductIdUseCase = new GetCartItemByProductIdUseCase(
      cartRepository
    );

    return await getCartItemByProductIdUseCase.execute(productId);
  }

  async function updateItemQuantityInCart(
    product: { id: IdObject; name: string },
    quantity: number
  ) {
    let updatedCart = cart;
    let toastMessage = "";
    if (quantity > 0) {
      const updateItemQuantityInCartUseCase = new UpdateItemQuantityInCartUseCase(
        cartRepository
      );
      updatedCart = await updateItemQuantityInCartUseCase.execute(
        product.id,
        quantity
      );
      toastMessage = `${product.name} quantity has been updated to ${quantity}`;
    } else {
      const deleteItemFromCartUseCase = new DeleteItemFormCartUseCase(
        cartRepository
      );
      updatedCart = await deleteItemFromCartUseCase.execute(product.id);
      toastMessage = `${product.name} has been removed from the cart!`;
    }
    setCart(updatedCart);

    toast.success(toastMessage);
  }

  useEffect(() => {
    async function getCart() {
      const getCartUseCase = new GetCartUseCase(cartRepository);
      const updatedCart = await getCartUseCase.execute();
      setCart(updatedCart);
    }

    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        deleteItemFromCart,
        getCartItemByProductId,
        updateItemQuantityInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
