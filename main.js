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
let playerSprite, player, atlasFrames, barrelSprite, barrel, sortArray = [], collisionArray = [];

function init() {
	//Creando Player 1
	let frames = e.filmstrip(e.assets["img/unnamed.png"], 24, 24);
	playerSprite = e.sprite(frames);
	playerSprite.fps = 12;
	playerSprite.show(0);
	//Player Shadow
	player = e.rectangle(10, 5, "white", "none", 0, 50, 50);
	player.add(playerSprite);
	playerSprite.x = -playerSprite.width/4;
	playerSprite.y = -playerSprite.height + 3;
	//player properties
	player.speed = 2;
	player.vx = 0;
	player.vy = 0;
	player.states = {
		idle: 0,
		walk: [1,6]
	}
	sortArray.push(player);


	//objects
	atlasFrames = e.filmstrip(e.assets["img/atlas.png"], 16, 16);
	barrelSprite = e.sprite(atlasFrames);
	barrelSprite.show(0);
	//shadow barrel
	barrel = e.rectangle(10, 5, "white", "none", 0, 100, 50);
	barrel.add(barrelSprite);
	barrelSprite.x = -barrelSprite.width / 4;
	barrelSprite.y = -barrelSprite.height + 3;
	sortArray.push(barrel);
	collisionArray.push(barrel);

	//controls
	let aKey = e.keyboard(e.keycode.A);
	let dKey = e.keyboard(e.keycode.D);
	let wKey = e.keyboard(e.keycode.W);
	let sKey = e.keyboard(e.keycode.S);
	aKey.press = () => {
		player.vx = -player.speed;
		player.scaleX = -1;
		playerSprite.playSequence(player.states.walk);
	}
	aKey.release = () => {
		player.vx = 0;
		playerSprite.show(0);
	}
	dKey.press = () => {
		player.vx = player.speed;
		player.scaleX = 1;
		playerSprite.playSequence(player.states.walk);
	}
	dKey.release = () => {
		player.vx = 0;
		playerSprite.show(0);
	}
	wKey.press = () => {
		player.vy = -player.speed;
		playerSprite.playSequence(player.states.walk);
	}
	wKey.release = () => {
		player.vy = 0;
		playerSprite.show(0);
	}
	sKey.press = () => {
		player.vy = player.speed;
		playerSprite.playSequence(player.states.walk);
	}
	sKey.release = () => {
		player.vy = 0;
		playerSprite.show(0);
	}
	//change state to loop
	e.state = play;

}

function play() {
	//update player position
	player.x += player.vx;
	player.y += player.vy;
	//update deepth sorting
	e.sorting(sortArray);
	//check for collition with objects
	e.hit(player, collisionArray, false, false, true, (collition, sprite) =>{
		player.x -= player.vx;
		player.y -= player.vy;
		player.vx = 0;
		player.vy = 0;
	})
}
