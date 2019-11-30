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
e.canvas.style.background = "grey";
e.scaleToWindow();
window.addEventListener("resize", event => {
	e.scaleToWindow();
});
//Global Vars
let playerSprite, player, 
	atlasFrames, 
	barrelSprite, barrel,
	sortArray = [],
	itemArray = [], 
	collisionArray = [];

function init() {
	atlasFrames = e.filmstrip(e.assets["img/atlas.png"], 16, 16);

	//draw map/background
	let map2d = [
		[5,6,7,5,6,7,5,4],
		[516,516,516,513,514,514,514,515],
		[516,517,518,545,546,546,546,547],
		[516,517,518,577,578,578,578,579],
		[516,516,516,5,6,5,7,4],
		[516,516,516,516,517,518,516,516],
		[5,6,7,5,6,7,5,4],
		[5,6,7,5,6,7,5,4]
	];

	let map1d = map2d.reduce((a, b) => a.concat(b));

	//crear tiles bg
	map1d.forEach((value, i) => {
		let x = (i % 8) * 16;
		let y = (Math.floor(i / 8)) * 16;
		let tile = e.sprite(atlasFrames, x, y);
		tile.show(value);
	}); 

	//draw details
	let detail2d = [
		[8,8,8,8,8,8,8,8],
		[8,8,8,8,8,8,8,8],
		[2,3,8,8,8,8,8,8],
		[128,129,8,8,8,8,8,8],
		[353,354,355,8,8,8,8,8],
		[385,386,387,8,8,8,8,8],
		[8,8,8,8,8,8,8,8],
		[8,8,8,8,8,8,8,8]
	];

	let detail1d = detail2d.reduce((a, b) => a.concat(b));

	detail1d.forEach((value, i) => {
		let x = (i % 8) * 16;
		let y = (Math.floor(i / 8)) * 16;
		let tile = e.sprite(atlasFrames, x, y);
		tile.show(value);
	}); 

	//create items
	let items2d = [
	[8,8,8,8,8,8,8,8],
	[281,8,8,8,8,8,8,8],
	[8,8,8,8,8,8,8,8],
	[8,8,8,8,8,8,8,8],
	[8,8,8,8,8,8,8,282],
	[8,8,8,8,8,8,8,8],
	[8,8,8,280,8,8,8,8],
	[8,8,8,8,8,8,8,8]
	];

	let items1d = items2d.reduce((a, b) => a.concat(b));

	items1d.forEach((value, i) => {
		if (value !== 8) {
			let x = (i % 8) * 16;
			let y = (Math.floor(i / 8)) * 16;
			let item = e.sprite(atlasFrames, x, y);
			item.show(value);
			item.name = "" + value;
			item.isItem = true;
			collisionArray.push(item);
			itemArray.push(item);
		}
	});

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

	//items
	// sword = e.sprite(atlasFrames, 70, 80);
	// sword.show(280);
	// sword.name = "Excalibur";
	// sword.isOnStage = true;
	// sword.collision = false;
	// collisionArray.push(sword);

	//objects
	barrelSprite = e.sprite(atlasFrames);
	barrelSprite.show(0);
	//shadow barrel
	barrel = e.rectangle(10, 5, "white", "none", 0, 100, 30);
	barrel.name = "Barrel Object";
	barrel.add(barrelSprite);
	barrelSprite.x = -barrelSprite.width / 4;
	barrelSprite.y = -barrelSprite.height + 3;
	sortArray.push(barrel);
	collisionArray.push(barrel);

	//fence object

	function createFence(atlas, value, x, y) {
		let fence = e.sprite(atlas);
		fence.show(value);
		let shadow = e.rectangle(10, 5, "white", "none", 0, x, y);
		shadow.add(fence);
		shadow.name = "Fence" + value;
		fence.x = -fence.width / 4;
		fence.y = -fence.height + 3;
		sortArray.push(shadow);
		collisionArray.push(shadow);
	}

	createFence(atlasFrames, 291, 46, 60);
	createFence(atlasFrames, 292, 62, 60);
	createFence(atlasFrames, 292, 78, 60);
	createFence(atlasFrames, 292, 94, 60);
	createFence(atlasFrames, 289, 110, 60);


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
	objectCollison();
}

function objectCollison() {
	let hitObject = e.hit(player, collisionArray, false, false, true, (collision, sprite) =>{
		//stop player
		if (sprite.isItem == undefined) {
			player.x -= player.vx;
			player.y -= player.vy;
			player.vx = 0;
			player.vy = 0;
		}
		//take items
		itemArray.forEach(item => {
			if (item == sprite && item.isItem) {
				collisionArray.splice(collisionArray.indexOf(item), 1);
				itemArray.splice(itemArray.indexOf(item), 1);
				e.stage.remove(item);
				item.isItem = false;
			}
		});
		// if (sprite.name == "Excalibur" && sprite.isOnStage) {
			// collisionArray.splice(collisionArray.indexOf(sword), 1);
			// e.stage.remove(sword);
			// sprite.isOnStage = false;
		// }	
	})
}