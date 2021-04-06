// At its simplest access control is either yes or no depending on users session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
  isAwesome({ session }: ListAccessArgs): boolean {
    return session?.data.name.includes("rob");
  },
};

// rule based function
// rules can return a boolean, or a filter which limits which guitars they can CRUD

export const rules = {
  canManageGuitars({ session }: ListAccessArgs) {
    // 1. do they have the permission of canManageGuitars
    if (permissions.canManageGuitars({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canReadGuitars({ session }: ListAccessArgs) {
    if (permissions.canManageGuitars({ session })) {
      return true;
    }
    return { status: "AVAILABLE" };
  },
};
