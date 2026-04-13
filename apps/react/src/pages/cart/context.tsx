import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CartRepository } from "$/infrastructure/repositories/cart.repository";
import {
  CartEntity,
  CartItemEntity,
  CartItemProductEntity,
  ProductEntity,
} from "@eshop/business/domain/entities";
import {
  AddToCartUseCase,
  DeleteItemFormCartUseCase,
  GetCartItemByProductIdUseCase,
  GetCartUseCase,
  UpdateItemQuantityInCartUseCase,
} from "@eshop/business/domain/usecases/cart";
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IdObject } from "@eshop/business/domain/value-objects";
import { useAuth } from "$/pages/authentication/hooks";

type CartContextProps = {
  cart: CartEntity;
  loading: boolean;
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
  loading: true,
  addToCart: async () => {},
  deleteItemFromCart: async () => {},
  getCartItemByProductId: async () => Promise.resolve(null),
  updateItemQuantityInCart: async () => {}
});

export const CartContextProvider = ({ children }: PropsWithChildren) => {
  const { token } = useAuth();
  const [cart, setCart] = useState<CartEntity>(new CartEntity());
  const [loading, setLoading] = useState(true);

  const cartRepository = useMemo(() => new CartRepository(token || undefined), [token]);

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

  async function getCartItemByProductId(productId: IdObject): Promise<CartItemEntity | null> {
    const getCartItemByProductIdUseCase = new GetCartItemByProductIdUseCase(cartRepository);

    return await getCartItemByProductIdUseCase.execute(productId);
  }

  async function updateItemQuantityInCart(product: ProductEntity, quantity: number) {
    let updatedCart = cart;
    let toastMessage = "";
    if (quantity > 0) {
      const updateItemQuantityInCartUseCase = new UpdateItemQuantityInCartUseCase(cartRepository);
      updatedCart =await updateItemQuantityInCartUseCase.execute(product.id, quantity);
      toastMessage = `${product.name} quantity has been updated to ${quantity}`
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
      setLoading(true);
      const getCartUseCase = new GetCartUseCase(cartRepository);
      const updatedCart = await getCartUseCase.execute();
      setCart(updatedCart);
      setLoading(false);
    }

    getCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
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
