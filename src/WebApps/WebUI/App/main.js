import Pet from "./lib/Pet/Pet.svelte";
import PetMedicalHistory from "./lib/PetMedicalHistory/PetMedicalHistory.svelte";
import PetBreed from "./lib/PetBreed/PetBreed.svelte"; 
import ConfigEmail from "./lib/ConfigEmail/ConfigEmail.svelte"
import MotivoDiscrepancia from "./lib/StockFisico/MotivoDiscrepancia.svelte";
import Stock from "./lib/StockFisico/index.svelte"
import Subcategoria from "./lib/Contabilidad/Subcategoria/index.svelte"
import Infrastructure from "$restaurant/Infrastructure/page.svelte"
import Product from "$restaurant/Product/page.svelte"
import Vehicle from "$mechanical/Vehicle/page.svelte"
import Support from "$mechanical/Support/page.svelte"

let target = document.querySelector("#pet")
if (target) {
    new Pet({ target })
}

target = document.querySelector("#pet-breed")
if (target) {
    new PetBreed({ target })
}

target = document.querySelector("#petMH")
if (target) {
    new PetMedicalHistory({ target })
}

target = document.querySelector("#configEmail")
if (target) {
    new ConfigEmail({ target })
}

target = document.querySelector("#motivoDiscrepancia")
if (target) {
    new MotivoDiscrepancia({ target })
}

target = document.querySelector("#stockFisico")
if (target) {
    new Stock({ target })
}

target = document.querySelector("#subcategoria")
if (target) {
    new Subcategoria({ target })
}


target = document.querySelector("#restaurant-infrastructure")
if (target) {
    new Infrastructure({ target })
}

target = document.querySelector("#restaurant-product")
if (target) {
    new Product({ target })
}

target = document.querySelector("#mechanical-vehicle")
if (target) {
    new Vehicle({ target })
}

target = document.querySelector("#mechanical-support")
if (target) {
    new Support({ target })
}


import App from "./App.svelte"
const app = new App({
    target: document.body
})
export default app
