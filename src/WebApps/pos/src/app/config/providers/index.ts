import {authProvider} from "@/config/providers/auth.provider";
import {tokenProvider} from "@/config/providers/token.provider";
import {orderProvider} from "@/config/providers/order.provider";
import {configProvider} from "@/config/providers/config.provider";
import {apiGreenProvider} from "@/config/providers/api-green.provider";
import {companyCustomerProvider} from "@/config/providers/company-customer.provider";

export const featureProviders = [
  authProvider,
  tokenProvider,
  orderProvider,
  configProvider,
  apiGreenProvider,
  companyCustomerProvider
];
