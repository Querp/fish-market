export class Sound {

    constructor(type) {
        const sound = new Audio(`audio/${type}.mp3`);
        sound.currentTime = 0;
        sound.play();
    }
}