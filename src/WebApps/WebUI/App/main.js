import Pet from "./lib/Pet/Pet.svelte";
import PetMedicalHistory from "./lib/PetMedicalHistory/PetMedicalHistory.svelte";
import PetBreed from "./lib/PetBreed/PetBreed.svelte"; 
import Counter from "./core/components/Counter.svelte";
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

//export default pet

const petMH = new PetMedicalHistory({
    target: document.getElementById('petMH'),
})

export default petMH
