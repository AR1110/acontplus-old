
import soundBeep from '/sound/beep-29.mp3';
import soundClear from '/sound/button-21.mp3';



function playSound(src: string): void {
    const sound = new Audio();
    sound.src = src;
    sound.play();
    sound.onended = () => {
        // eslint-disable-next-line no-delete-var
    };
}

export const clearSound = () => playSound(soundClear);
export const addSound = () => playSound(soundBeep)
