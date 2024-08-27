const beepSoundSrc = 'sound/beep-29.mp3';
const clearSoundSrc = 'sound/button-21.mp3';


// Crea una instancia global de Audio
const audio = new Audio();

function playSound(src: string) {
    // Detener y liberar la instancia de audio existente
    audio.pause();
    audio.currentTime = 0;

    // Asignar la fuente y reproducir el sonido
    audio.src = src;
    audio.play().catch(error => {
        console.error('Error playing sound:', error);
    });
}

// Funciones específicas para los sonidos
export function playClearSound() {
    playSound(clearSoundSrc);
}

export function playBeepSound() {
    playSound(beepSoundSrc);
}
