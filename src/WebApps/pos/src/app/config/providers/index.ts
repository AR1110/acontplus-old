import {authProvider} from "@/config/providers/auth.provider";
import {tokenProvider} from "@/config/providers/token.provider";
import {orderProvider} from "@/config/providers/order.provider";
import {configProvider} from "@/config/providers/config.provider";
import {apiGreenProvider} from "@/config/providers/api-green.provider";
import {companyCustomerProvider} from "@/config/providers/company-customer.provider";
import {menuProvider} from "@/config/providers/menu.provider";

export const featureProviders = [
  authProvider,
  tokenProvider,
  orderProvider,
  configProvider,
  apiGreenProvider,
  companyCustomerProvider,
  menuProvider
];
