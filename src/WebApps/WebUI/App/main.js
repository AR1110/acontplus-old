import Pet from "$pet/Pet.svelte";
import PetMedicalHistory from "$petmedicalhistory/PetMedicalHistory.svelte";
import PetBreed from "$petbreed/PetBreed.svelte";
import ConfigEmail from "./routes/ConfigEmail/ConfigEmail.svelte";
import MotivoDiscrepancia from "./routes/StockFisico/MotivoDiscrepancia.svelte";
import Stock from "./routes/StockFisico/index.svelte";
import Subcategoria from "./routes/Contabilidad/Subcategoria/index.svelte";
import Infrastructure from "$restaurant/Infrastructure/page.svelte";
import Product from "$restaurant/Product/page.svelte";
import Reports from "$restaurant/Reports/page.svelte";
import Vehicle from "$mechanical/Vehicle/page.svelte";
import Support from "$mechanical/Support/page.svelte";
import Maintenance from "$mechanical/Maintenance/page.svelte";

let target = document.querySelector("#pet");
if (target) {
  new Pet({ target });
}

target = document.querySelector("#pet-breed");
if (target) {
  new PetBreed({ target });
}

target = document.querySelector("#petMH");
if (target) {
  new PetMedicalHistory({ target });
}

target = document.querySelector("#configEmail");
if (target) {
  new ConfigEmail({ target });
}

target = document.querySelector("#motivoDiscrepancia");
if (target) {
  new MotivoDiscrepancia({ target });
}

target = document.querySelector("#stockFisico");
if (target) {
  new Stock({ target });
}

target = document.querySelector("#subcategoria");
if (target) {
  new Subcategoria({ target });
}

target = document.querySelector("#restaurant-infrastructure");
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

import App from "./App.svelte";
const app = new App({
  target: document.body,
});
export default app;
