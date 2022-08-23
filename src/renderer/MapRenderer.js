import DomRenderer from "./basic/DomRenderer";
import {SVG} from "@svgdotjs/svg.js";
import PathRenderer from "./PathRenderer";
import CollectionRenderer from "./basic/CollectionRenderer";
import LocationRenderer from "./LocationRenderer";
import Pixies from "../class/basic/Pixies";

export default class MapRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	saveGame;

	/**
	 * @type MapModel
	 */
	map;

	/**
	 * @type any
	 */
	canvas;

	/**
	 * @type any
	 */
	draw;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.saveGame = model;
		this.map = game.resources.map;
		this.onViewBoxChangeHandler = () => this.updateSize();

	}

	activateInternal() {
		this.container = this.addElement('div', ['map', 'container-host']);
		this.canvas = Pixies.createElement(this.container, 'canvas');
		this.context2d = this.canvas.getContext("2d");

		this.draw = SVG().addTo(this.container);
		this.pathsGroup = this.draw.group();
		this.pathsRenderer = this.addChild(new CollectionRenderer(this.game, this.map.paths, (model) => new PathRenderer(this.game, model, this.pathsGroup)));
		//this.pathsRenderer.activate();
		this.locationsGroup = this.draw.group();
		this.locationsRenderer = this.addChild(new CollectionRenderer(this.game, this.map.locations, (model) => new LocationRenderer(this.game, model, this.locationsGroup)));
		//this.locationsRenderer.activate();

		this.mapImage = null;
		this.game.assets.getAsset(
			'img/world.jpg',
			(img) => {
				this.mapImage = img;
				this.updateSize();
				this.game.viewBoxSize.addOnChangeListener(this.onViewBoxChangeHandler);
			}
		);
	}

	deactivateInternal() {
		this.game.viewBoxSize.removeOnChangeListener(this.onViewBoxChangeHandler);
		this.draw.remove();
		this.draw = null;
		Pixies.destroyElement(this.canvas);
		this.canvas = null;
		Pixies.destroyElement(this.container);
	}

	renderInternal() {
		if (this.saveGame.zoom.isDirty || this.saveGame.coordinates.isDirty) {
			this.updateZoom();
		}
		console.log('rendering map');
	}

	updateSize() {
		this.draw.size(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.canvas.width = this.game.viewBoxSize.x;
		this.canvas.height = this.game.viewBoxSize.y;
		this.updateZoom();
	}

	updateZoom() {
		this.draw.viewbox(
			this.saveGame.coordinates.x,
			this.saveGame.coordinates.y,
			this.game.viewBoxSize.x * this.saveGame.zoom.get(),
			this.game.viewBoxSize.y * this.saveGame.zoom.get()
		);
		this.updateMapImage();
	}

	updateMapImage() {
		if (!this.mapImage) {
			console.warn('Map image not loaded!');
			return;
		}
		this.context2d.clearRect(0, 0, this.context2d.canvas.width, this.context2d.canvas.height);
		this.context2d.drawImage(
			this.mapImage,
			this.saveGame.coordinates.x,
			this.saveGame.coordinates.y,
			this.game.viewBoxSize.x * this.saveGame.zoom.get(),
			this.game.viewBoxSize.y * this.saveGame.zoom.get(),
			0,
			0,
			this.game.viewBoxSize.x,
			this.game.viewBoxSize.y
		);
	}

}
