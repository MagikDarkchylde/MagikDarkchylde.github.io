import { stageCollision, tilesCollision } from "./lib/collision.js";
import { player } from "./lib/player.js";
//capturar tag
let content = document.getElementById('content');
content.innerHTML= `<div class="box">Canvas title</div>`;

//capturar canvas
let canvas = document.getElementById('canvas');
canvas.setAttribute("width", "256");
canvas.setAttribute("height", "256");
canvas.style.border = "1px dashed black";
canvas.style.background = "#000";
//capturar contexto 2d
let ctx = canvas.getContext("2d");

//vars 
let char = player(ctx);
//disenhar bg
let bgArray2D = [
[1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,1],
[0,0,0,0,0,0,0,1],
[0,0,0,0,0,0,0,1],
[1,0,0,0,1,0,0,1],
[1,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1]]

let array1D = bgArray2D.reduce((a,b) => a.concat(b));
let tilesArray = array1D.map((element, i) => {
	let x = (i % 8) * char.charWH;
	let y = (Math.floor(i / 8)) * char.charWH;
	return {x: x, y: y, width: char.charWH, height: char.charWH, value: element};
});
drawBG();
//disenhar Char
char.drawChar();

//add listener
window.addEventListener("keydown", char.onKeyDown, false);
window.addEventListener("keyup", char.onKeyUp, false);
//GameLoop
gameLoop();
function gameLoop() {
	requestAnimationFrame(gameLoop);
	//clear screen
	//clearRect: x,y, width screen, height screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//update player position
	char.update
	//collision
	let collision1 = stageCollision( { x: char.x, y: char.y, width: char.charWH, height: char.charWH }, { width: canvas.width, height: canvas.height });
	if (collision1 !== "") {
		char.stop();
	}
	let collision2 = tilesCollision( { x: char.x, y: char.y, width: char.charWH, height: char.charWH }, tilesArray );
	if (collision2) {
		char.stop();
	}
	//update view
	drawBG();
	char.drawChar();
}


function drawBG() {

	array1D.forEach((element, i) => {
		if (element == 1) {
			let x = (i % 8) * 32;
			let y = (Math.floor(i / 8)) * 32;
			ctx.beginPath();
			ctx.fillStyle = "#778899";
			ctx.rect(x,y,32,32);
			ctx.fill();
		} else {
			let x = (i % 8) * 32;
			let y = (Math.floor(i / 8)) * 32;
			ctx.beginPath();
			ctx.fillStyle = "#CCC";
			ctx.rect(x,y,32,32);
			ctx.fill();
		}
	})
}

