export function createItemBox(e, atlas, x, y) {
	let canvas = e.rectangle(128, 16, "#596275", "#303952", 2, x, y);
	canvas.counter = 0;
	canvas.addItem = (value) => {
		console.log("Item added: ", value);
		let item = e.sprite(atlas);
		item.show(parseFloat(value));
		canvas.add(item);
		item.x = 1 + canvas.counter * 16;
		item.y = 1;

		canvas.counter ++;
	}
	return canvas;
}