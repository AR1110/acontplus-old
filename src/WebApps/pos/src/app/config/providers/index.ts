import {authProvider} from "@/config/providers/auth.provider";
import {tokenProvider} from "@/config/providers/token.provider";
import {orderProvider} from "@/config/providers/order.provider";

export const featureProviders = [
  authProvider,
  tokenProvider,
  orderProvider
];
