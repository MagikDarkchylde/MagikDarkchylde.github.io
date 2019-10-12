
export function stageCollision(player, stage) {
	let collision = "";
	if (player.x < 0) {
		// x -= speedX;
		// speedX = 0;
		collision = "left";
	} else if (player.y < 0) {
		// y -= speedY;
		// speedY = 0;
		collision = "top";
	} else if (player.x + player.width > stage.width) {
		// x -= speedX;
		// speedX = 0;
		collision = "rigth";
	} else if (player.y + player.height > stage.height) {
		// y -= speedY;
		// speedY = 0;
		collision = "bottom";
	}
	return collision;
}

export function tilesCollision(player, array) { 
	let collision = false;
	array.forEach(tile => {
		//check if tile collision
		if (tile.value == 1) {
			//check collision horizontal
			if (player.x + player.width > tile.x && player.x < tile.x + tile.width) {
				//check collision vertical
				if (player.y + player.height > tile.y && player.y < tile.y + tile.height) {
					// x -= speedX;
					// y -= speedY;
					// speedX = 0;
					// speedY = 0;
					// playerColor = "#e67e22";
					collision = true;
				} 
			}
		} 
		
	});
	return collision;
}