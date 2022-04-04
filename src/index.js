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

const location = game.map.locations.createNode();
location.name = 'Location';
location.coordinates.set(550, 450);
const conn = location.connections.add();
conn.pathId.set(1);

const location2 = game.map.locations.createNode();
location2.name = 'Location 2';
location2.coordinates.set(1550, 450);
const conn2 = location2.connections.add();
conn2.pathId.set(1);
conn2.forward.set(false);
const conn3 = location2.connections.add();
conn3.pathId.set(2);
conn3.forward.set(false);

const path = game.map.paths.createNode();
const w1 = path.waypoints.add(new WaypointModel());
w1.coordinates.set(245, 250);
w1.a.set(255, 225);
w1.b.set(265, 285);

const w2 = path.waypoints.add(new WaypointModel());
w2.coordinates.set(450, 450);
w2.a.set(455, 425);
w2.b.set(445, 485);

const w3 = path.waypoints.add(new WaypointModel());
w3.coordinates.set(500, 700);
w3.a.set(585, 725);
w3.b.set(565, 785);

const w4 = path.waypoints.add(new WaypointModel());
w4.coordinates.set(1250, 380);
w4.a.set(1205, 725);
w4.b.set(1185, 885);

const path2 = game.map.paths.createNode();
const w5 = path2.waypoints.add(new WaypointModel());
w5.coordinates.set(145, 150);
w5.a.set(155, 125);
w5.b.set(165, 185);

const w6 = path2.waypoints.add(new WaypointModel());
w6.coordinates.set(50, 50);
w6.a.set(55, 125);
w6.b.set(45, 85);

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
