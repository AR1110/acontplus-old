import Pet from "./lib/Pet/Pet.svelte";
import PetMedicalHistory from "./lib/PetMedicalHistory/PetMedicalHistory.svelte";
import PetBreed from "./lib/PetBreed/PetBreed.svelte"; 
import Counter from "./core/components/Counter.svelte";
import ConfigEmail from "./lib/ConfigEmail/ConfigEmail.svelte"
import MotivoDiscrepancia from "./lib/StockFisico/MotivoDiscrepancia.svelte";
import Stock from "./lib/StockFisico/index.svelte"
import Subcategoria from "./lib/Contabilidad/Subcategoria/index.svelte"

// import App from "./App.svelte"
// const app = new App({
//     target: document.getElementById('app'),
// })
// export default app

// const breed = new PetBreed({
//     target: document.getElementById('pet-breed'),
// })
// export default breed

// const pet = new Pet({
//     target: document.getElementById('pet'),
// })
// export default pet

// const petMH = new PetMedicalHistory({
//     target: document.getElementById('petMH'),
// })
// export default petMH


// const configEmail = new ConfigEmail({
//     target: document.getElementById('configEmail'),
// })
// export default configEmail

// const motivoDiscrepancia = new MotivoDiscrepancia({
//     target: document.getElementById('motivoDiscrepancia'),
// })
// export default motivoDiscrepancia

const stock = new Stock({
    target: document.getElementById('stockFisico'),
})
export default stock


// const subcategoria = new Subcategoria({
//     target: document.getElementById('subcategoria'),
// })
// export default subcategoria