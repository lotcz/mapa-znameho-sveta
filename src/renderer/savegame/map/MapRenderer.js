import DomRenderer from "../../basic/DomRenderer";
import {SVG} from "@svgdotjs/svg.js";
import PathRenderer from "./PathRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";
import LocationRenderer from "./LocationRenderer";
import Pixies from "../../../class/basic/Pixies";
import MapMenuRenderer from "./MapMenuRenderer";
import MapPartyRenderer from "./MapPartyRenderer";
import CurrentLocationRenderer from "./CurrentLocationRenderer";
import NullableNodeRenderer from "../../basic/NullableNodeRenderer";
import CurrentPathRenderer from "./CurrentPathRenderer";

export default class MapRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

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

		this.model = model;
		this.map = game.resources.map;
		this.onViewBoxChangeHandler = () => this.updateSize();

		this.addChild(new NullableNodeRenderer(this.game, this.model.currentLocation, (m) => new CurrentLocationRenderer(this.game, m, this.draw)));
		this.addChild(new NullableNodeRenderer(this.game, this.model.currentPath, (m) => new CurrentPathRenderer(this.game, m, this.draw)));
	}

	activateInternal() {
		this.container = this.addElement('div', ['map', 'container-host']);
		this.canvas = Pixies.createElement(this.container, 'canvas');
		this.context2d = this.canvas.getContext("2d");

		this.draw = SVG().addTo(this.container);
		this.pathsGroup = this.draw.group();
		this.locationsGroup = this.draw.group();
		this.partyGroup = this.draw.group();

		this.mapImage = null;
		this.game.assets.getAsset(
			'img/world-HD.jpg',
			(img) => {
				if (!this.draw) {
					return;
				}
				this.mapImage = img;
				this.updateSize();
				this.game.viewBoxSize.addOnChangeListener(this.onViewBoxChangeHandler);
			}
		);

		this.pathsRenderer = this.addChild(new CollectionRenderer(this.game, this.map.paths, (model) => new PathRenderer(this.game, model, this.pathsGroup)));
		this.locationsRenderer = this.addChild(new CollectionRenderer(this.game, this.map.locations, (model) => new LocationRenderer(this.game, model, this.locationsGroup)));
		this.partyRenderer = this.addChild(new MapPartyRenderer(this.game, this.model, this.partyGroup));

		this.menuRenderer = this.addChild(new MapMenuRenderer(this.game, this.model, this.container));
	}

	deactivateInternal() {
		this.game.viewBoxSize.removeOnChangeListener(this.onViewBoxChangeHandler);
		this.resetChildren();
		this.draw.remove();
		this.draw = null;
		Pixies.destroyElement(this.canvas);
		this.canvas = null;
		Pixies.destroyElement(this.container);
	}

	renderInternal() {
		if (this.model.zoom.isDirty || this.model.coordinates.isDirty) {
			this.updateZoom();
		}
	}

	updateSize() {
		this.draw.size(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.canvas.width = this.game.viewBoxSize.x;
		this.canvas.height = this.game.viewBoxSize.y;
		this.updateZoom();
	}

	updateZoom() {
		this.draw.viewbox(
			this.model.coordinates.x,
			this.model.coordinates.y,
			this.game.viewBoxSize.x * this.model.zoom.get(),
			this.game.viewBoxSize.y * this.model.zoom.get()
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
			this.model.coordinates.x,
			this.model.coordinates.y,
			this.game.viewBoxSize.x * this.model.zoom.get(),
			this.game.viewBoxSize.y * this.model.zoom.get(),
			0,
			0,
			this.game.viewBoxSize.x,
			this.game.viewBoxSize.y
		);
	}

}
