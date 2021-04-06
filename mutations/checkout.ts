/* eslint-disable */
import {
  CartItemCreateInput,
  OrderCreateInput,
} from "../.keystone/schema-types";
import { KeystoneContext } from "@keystone-next/types";
import stripeConfig from "../lib/stripe";

const graphql = String.raw;

interface Arguments {
  token: string;
}

export default async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. make sure the user is signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error("Sorry! you must be signed in to create an order!");
  }
  // 1.5 query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        guitar {
          id
          name
          price
          description
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });
  console.dir(user, { depth: null });
  // 2. calculate the total price for their order
  const cartItems = user.cart.filter((cartItem) => cartItem.guitar);
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity + cartItem.guitar.price;
  },
  0);
  console.log(amount);
  // 3. create the charge with thei stripe library
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: "USD",
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });
  // 4. convert the cartitems to orderitems
  // 5. create the order and return it
}
