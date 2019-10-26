import { game } from "./engine/engine.js";

let e = game(
	480, 
	240, 
	init, 
	[
		"img/unnamed.png", 
		"img/gabe.png",
		"img/atlas.png"
	]);
e.start();
e.canvas.style.background = "#2e86de";
e.scaleToWindow();
window.addEventListener("resize", event => {
	e.scaleToWindow();
});
//Global Vars
let playerSprite, player;

function init() {
	//Creando Player 1
	let frames = e.filmstrip(e.assets["img/unnamed.png"], 24, 24);
	let playerSprite = e.sprite(frames);
	playerSprite.x = 12;
	playerSprite.y = 36;
	playerSprite.fps = 12;
	playerSprite.playSequence([1,6]);
	//Player Shadow
	player = e.rectangle(10, 5, "white", "none", 0, 50, 50);
	player.add(playerSprite);


	//change state to loop
	e.state = play;
}

function play() {
	console.log("this will be called 60 frames per second");
}
