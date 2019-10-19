import { game } from "./engine/engine.js";

let e = game(480, 240, init, ["img/unnamed.png"]);
e.start();

function init() {
	console.log ("Starting");
}