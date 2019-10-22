import { game } from "./engine/engine.js";

let e = game(480, 240, init, ["img/unnamed.png", "img/gabe.png"]);
e.start();
e.canvas.style.background = "#2e86de";
e.scaleToWindow();
window.addEventListener("resize", event => {
	e.scaleToWindow();
});

function init() {
	//Creando Player 1
	let frames = e.filmstrip(e.assets["img/unnamed.png"], 24, 24);
	let player = e.sprite(frames);
	player.x = 12;
	player.y = 36;
	player.fps = 12;
	player.playSequence([1,6]);
	// player.show(0);

	//creando player 2
	let frames2 = e.filmstrip(e.assets["img/gabe.png"], 24, 24);
	let player2 = e.sprite(frames2);
	player2.x = 60;
	player2.y = 36;
	player2.fps = 12;
	player2.playSequence([1,6]);
	//change state to loop
	e.state = play;
}

function play() {
	console.log("this will be called 60 frames per second");
}
