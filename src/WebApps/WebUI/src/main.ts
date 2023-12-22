import Infrastructure from "@/routes/restaurant/Infrastructure/page.svelte";
import Product from "@/routes/restaurant/Product/page.svelte";
import Reports from "@/routes/restaurant/Reports/page.svelte";
import Vehicle from "@/routes/mechanical/Vehicle/page.svelte";
import Support from "@/routes/mechanical/Support/page.svelte";
import Maintenance from "@/routes/mechanical/Maintenance/page.svelte";
import TechnicalSupport from "@/routes/TechnicalSupport/page.svelte";

//Contabilidad report 
import VentasReports from "@/routes/ventas/report/page.svelte";
 
let target = document.querySelector("#restaurant-infrastructure");
if (target) {
  new Infrastructure({ target });
}

target = document.querySelector("#restaurant-product");
if (target) {
  new Product({ target });
}

target = document.querySelector("#restaurant-reports");
if (target) {
  new Reports({ target });
}

target = document.querySelector("#mechanical-vehicle");
if (target) {
  new Vehicle({ target });
}

target = document.querySelector("#mechanical-support");
if (target) {
  new Support({ target });
}

target = document.querySelector("#mechanical-maintenance");
if (target) {
  new Maintenance({ target });
}

target = document.querySelector("#technical-support");
if (target) {
  new TechnicalSupport({ target });
} 

target = document.querySelector("#ventas-report");
if (target) {
    new VentasReports({ target });
} 

import App from "./App.svelte";
const app = new App({
  target: document.body,
});
export default app;
