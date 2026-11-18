import { createAuthClient } from "better-auth/react";
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: { role: { type: "string" }, isBlocked: { type: "boolean" }, phone: { type: "string" } },
    }),
  ],
});
