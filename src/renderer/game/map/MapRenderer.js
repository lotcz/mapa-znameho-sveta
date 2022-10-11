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

	constructor(game, model, dom, rightPanel) {
		super(game, model, dom);

		this.model = model;
		this.rightPanel = rightPanel;
		this.map = game.resources.map;

		this.addAutoEvent(
			this.game.mainLayerSize,
			'change',
			() => this.updateSize(),
			true
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'map container-host');
		this.canvas = Pixies.createElement(this.container, 'canvas', 'container');
		this.context2d = this.canvas.getContext("2d");

		this.draw = SVG().addTo(this.container);
		this.draw.addClass('map-svg');
		this.draw.addClass('container');
		this.pathsGroup = this.draw.group();
		this.locationsGroup = this.draw.group();
		this.currentGroup = this.draw.group();
		this.partyGroup = this.draw.group();

		this.addChild(new NullableNodeRenderer(this.game, this.model.currentLocation, (m) => new CurrentLocationRenderer(this.game, m, this.currentGroup)));
		this.addChild(new NullableNodeRenderer(this.game, this.model.currentPath, (m) => new CurrentPathRenderer(this.game, m, this.currentGroup)));
		this.addChild(new CollectionRenderer(this.game, this.map.paths, (model) => new PathRenderer(this.game, model, this.pathsGroup)));
		this.addChild(new CollectionRenderer(this.game, this.map.locations, (model) => new LocationRenderer(this.game, model, this.locationsGroup)));
		this.addChild(new MapPartyRenderer(this.game, this.model, this.partyGroup));
		this.addChild(new MapMenuRenderer(this.game, this.model, this.rightPanel));

		this.mapImage = null;
		this.game.assets.getAsset(
			'img/world-HD.jpg',
			(img) => {
				if (!this.draw) {
					console.log('map loaded after renderer was deactivated');
					return;
				}
				this.mapImage = img;
				this.updateSize();
			}
		);

		this.model.triggerEvent('trigger-resize');
	}

	deactivateInternal() {
		this.resetChildren();
		this.draw.remove();
		this.draw = null;
		Pixies.destroyElement(this.canvas);
		this.canvas = null;
		this.mapImage = null;
		Pixies.destroyElement(this.container);
		this.model.triggerEvent('trigger-resize');
	}

	renderInternal() {
		if (this.model.zoom.isDirty || this.model.mapCornerCoordinates.isDirty) {
			this.updateZoom();
		}
	}

	updateSize() {
		this.draw.size(this.game.mainLayerSize.x, this.game.mainLayerSize.y);
		this.canvas.width = this.game.mainLayerSize.x;
		this.canvas.height = this.game.mainLayerSize.y;
		this.updateZoom();
	}

	updateZoom() {
		this.draw.viewbox(
			this.model.mapCornerCoordinates.x,
			this.model.mapCornerCoordinates.y,
			this.game.mainLayerSize.x / this.model.zoom.get(),
			this.game.mainLayerSize.y / this.model.zoom.get()
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
			this.model.mapCornerCoordinates.x,
			this.model.mapCornerCoordinates.y,
			this.game.mainLayerSize.x / this.model.zoom.get(),
			this.game.mainLayerSize.y / this.model.zoom.get(),
			0,
			0,
			this.game.mainLayerSize.x,
			this.game.mainLayerSize.y
		);
	}

}
