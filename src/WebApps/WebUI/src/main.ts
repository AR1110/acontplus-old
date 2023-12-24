import Infrastructure from "@/routes/restaurant/Infrastructure/page.svelte";
import Product from "@/routes/restaurant/Product/page.svelte";
import Reports from "@/routes/restaurant/Reports/page.svelte"; 
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
target = document.querySelector("#ventas-report");
if (target) {
    new VentasReports({ target });
} 

import App from "./App.svelte";
const app = new App({
  target: document.body,
});
export default app;
