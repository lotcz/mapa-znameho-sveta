import GameModel from "./model/game/GameModel";
import GameController from "./controller/game/GameController";
import GameRenderer from "./renderer/game/GameRenderer";
import Stats from 'three/examples/jsm/libs/stats.module'

const MAX_DELTA = 100;
const DEBUG_MODE_ENABLED = true;
const SHOW_STATS = false;

const game = new GameModel(DEBUG_MODE_ENABLED);

const controller = new GameController(game);
controller.activate();

const renderer = new GameRenderer(game, window.document.body);
renderer.activate();

if (DEBUG_MODE_ENABLED) {
	window['game'] = game;
}

const stats = SHOW_STATS ? new Stats() : false;
if (stats) {
	document.body.appendChild(stats.dom);
}

let lastTime = performance.now();

const updateLoop = function () {
	const time = performance.now();
	const delta = time - lastTime;
	lastTime = time;

	if (delta < MAX_DELTA)
	{
		if (!game.assets.isLoading.get()) {
			controller.update(delta);
			renderer.render();
		}
	}

	if (stats) {
		stats.update();
	}

	requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);
