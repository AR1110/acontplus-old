import Pet from "./app/Pet/Pet.svelte";
import PetMedicalHistory from "./app/PetMedicalHistory/PetMedicalHistory.svelte";
import PetBreed from "./app/PetBreed/PetBreed.svelte"; 
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
