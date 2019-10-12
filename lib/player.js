export function player(ctx) {
	let playerObj = {
		x: 35,
		y: 35,
		speedX: 0,
		speedY: 0,
		charWH: 32,
		playerColor = "#27ae60"
	}

	playerObj.drawChar = () => {
		//update screen
		ctx.beginPath();
		ctx.fillStyle = playerObj.playerColor;
		//params: x,y, width, heigth
		ctx.rect(playerObj.x, playerObj.y, playerObj.charWH, playerObj.charWH);
		ctx.fill();
	}

	playerObj.onKeyDown = (event) => {
		if (event.keyCode == 68) {
			playerObj.speedX = 5;
			playerObj.playerColor = "#27ae60";
		} else if (event.keyCode == 65) {
			playerObj.speedX = -5;
			playerObj.playerColor = "#27ae60";
		} else if (event.keyCode == 87){
			playerObj.speedY = -5;
			playerObj.playerColor = "#27ae60";
		} else if (event.keyCode == 83) {
			playerObj.speedY = 5;
			playerObj.playerColor = "#27ae60";
		}	
	}
	playerObj.onKeyUp = (event) => {
		playerObj.speedX = 0;
		playerObj.speedY = 0;
	}

	playerObj.update = () => {
		playerObj.x += playerObj.speedX;
		playerObj.y += playerObj.speedY;
	}

	playerObj.stop = () => {
		playerObj.x += -playerObj.speedX;
		playerObj.y += -playerObj.speedY;
		playerObj.speedX = 0;
		playerObj.speedY = 0;
	}

	return playerObj;
}