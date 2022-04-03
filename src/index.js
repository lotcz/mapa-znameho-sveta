import "./style.css";

import GameController from "./controller/GameController";
import GameModel from "./model/GameModel";
import GameRenderer from "./renderer/GameRenderer";
import WaypointModel from "./model/WaypointModel";

const MAX_DELTA = 500;
const DEBUG_MASTER = true;

const game = new GameModel();

const controller = new GameController(game);
controller.activate();

const renderer = new GameRenderer(game, window.document.body);
renderer.activate();

const w1 = game.map.path.waypoints.add(new WaypointModel());
w1.coordinates.set(45, 50);
w1.a.set(55, 25);
w1.b.set(65, 85);

const w2 = game.map.path.waypoints.add(new WaypointModel());
w2.coordinates.set(50, 50);
w2.a.set(55, 125);
w2.b.set(45, 85);

const w3 = game.map.path.waypoints.add(new WaypointModel());
w3.coordinates.set(500, 700);
w3.a.set(585, 725);
w3.b.set(565, 785);

const w4 = game.map.path.waypoints.add(new WaypointModel());
w4.coordinates.set(1250, 380);
w4.a.set(1205, 725);
w4.b.set(1185, 885);


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
		controller.update(delta);
		renderer.render();
	} else {
		console.log('skipped frame');
	}
	requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);
