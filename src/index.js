import "./style.css";

import GameController from "./controller/GameController";
import GameModel from "./model/GameModel";
import GameRenderer from "./renderer/GameRenderer";

const MAX_DELTA = 500;
const DEBUG_MASTER = true;

const game = new GameModel();

const controller = new GameController(game);
controller.activate();

const renderer = new GameRenderer(game, window.document.body);
renderer.activate();

if (DEBUG_MASTER) {
	window['game'] = game;
}

let lastTime = null;

const updateLoop = function () {
	const time = performance.now();
	if (!lastTime) lastTime = time;
	const delta = (time - lastTime);
	lastTime = time;

	if (delta < MAX_DELTA)
	{
		if (!game.assets.isLoading.get()) {
			controller.update(delta);
			renderer.render();
		}
	} else {
		console.log(`Waited for ${Math.round(delta/500)/2} s and skipped frame rendering.`);
	}
	requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);
