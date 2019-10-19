import { game } from "./engine/engine.js";

let e = game(480, 240, init, ["img/unnamed.png"]);
e.start();
e.canvas.style.background = "black";
e.scaleToWindow();
window.addEventListener("resize", event => {
	e.scaleToWindow();
});

function init() {
	console.log ("Starting");
	let frames = e.filmstrip(e.assets["img/unnamed.png"], 24, 24);
	let player = e.sprite(frames);
	player.fps = 12;
	player.playSequence([1,6]);
	//change state to loop
	e.state = play;
}

function play() {
	console.log("this will be called 60 frames per second");
}
