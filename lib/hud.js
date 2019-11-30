export function createHUD (e, x, y) {
	let bar = e.rectangle(32, 4, "#303952", "none", 0, x, y);
	let health = e.rectangle(28, 2, "#e15f41", "none", 0, x + 2, y + 1);

	let grupo = e.group(bar, health);

	grupo.hit = () => {
		health.width--;
	}

	return grupo;
}