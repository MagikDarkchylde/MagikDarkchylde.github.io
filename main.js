import { game } from "./engine/engine.js";

let e = game(480, 240, init, ["img/unnamed.png"]);
e.start();

function init() {
	console.log ("Starting");
	let frames = e.filmstrip(e.assets["img/unnamed.png"], 24, 24);
	let player = e.sprite(frames);
}

