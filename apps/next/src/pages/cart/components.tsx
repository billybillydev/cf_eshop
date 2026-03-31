"use client";

import {
  CartItemEntity,
  CartItemProductEntity,
} from "@eshop/business/domain/entities";
import { PriceObject } from "@eshop/business/domain/value-objects";
import Link from "next/link";

export function CartList({
  items,
  deleteItemFromCart,
}: {
  items: CartItemEntity[];
  deleteItemFromCart(product: CartItemProductEntity): Promise<void>;
}) {
  async function removeItem(product: CartItemProductEntity) {
    if (window.confirm(`Remove ${product.name} from cart ?`)) {
      deleteItemFromCart(product);
    }
  }

  return (
    <ul className="cart-list">
      {items.map(({ product, quantity }) => {
        return (
          <li key={product.id.value()} className="cart-item">
            <img
              src={`${product.image}/thumbnail`}
              alt={product.name}
              style={{
                width: "12rem",
                aspectRatio: "1",
                objectFit: "cover",
              }}
            />
            <div className="cart-item-container">
              <div className="cart-item-quantity-and-price">
                <p>
                  <Link href={`/products/${product.code}`}>{product.name}</Link>
                </p>
                <p>
                  {product.price.toString()} x {quantity} ={" "}
                  {new PriceObject(
                    product.price.getValue() * quantity
                  ).toString()}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="btn btn-danger"
                  onClick={() => removeItem(product)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
