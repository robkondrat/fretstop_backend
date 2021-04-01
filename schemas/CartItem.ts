import { integer, relationship, select, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";

export const CartItem = list({
  // TODO: access
  ui: {
    listView: {
      initialColumns: ["guitar", "quantity", "user"],
    },
  },
  fields: {
    // TODO: custom label in here
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    guitar: relationship({ ref: "Guitar" }),
    user: relationship({ ref: "User.cart" }),
  },
});
