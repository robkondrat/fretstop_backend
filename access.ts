// At its simplest access control is either yes or no depending on users session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => {
    permission,
      function ({ session }: ListAccessArgs) {
        return !!session?.data.role?.[permission];
      };
  })
);

export const permissions = {
  ...generatedPermissions,
  isAwesome({ session }: ListAccessArgs) {
    return session?.data.name.includes("rob");
  },
};
