import DomRenderer from "./DomRenderer";
import {SVG} from "@svgdotjs/svg.js";
import PathRenderer from "./PathRenderer";
import MapImage from "../../res/img/map.jpg";
import CollectionRenderer from "./CollectionRenderer";
import LocationRenderer from "./LocationRenderer";
import Pixies from "../class/Pixies";

export default class MapRenderer extends DomRenderer {

	/**
	 * @type MapModel
	 */
	model;

	/**
	 * @type any
	 */
	draw;

	/**
	 * @type any
	 */
	canvas;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.onViewBoxChangeHandler = () => this.updateSize();

	}

	activateInternal() {
		this.canvas = this.addElement('canvas');
		this.context2d = this.canvas.getContext("2d");
		this.mapImage = new Image();
		this.mapImage.src = MapImage;

		this.draw = SVG().addTo(this.dom);

		this.pathsGroup = this.draw.group();
		this.pathsRenderer = this.addChild(new CollectionRenderer(this.game, this.model.paths, (model) => new PathRenderer(this.game, model, this.pathsGroup)));
		this.pathsRenderer.activate();

		this.locationsGroup = this.draw.group();
		this.locationsRenderer = this.addChild(new CollectionRenderer(this.game, this.model.locations, (model) => new LocationRenderer(this.game, model, this.locationsGroup)));
		this.locationsRenderer.activate();

		this.updateSize();
		this.game.viewBoxSize.addOnChangeListener(this.onViewBoxChangeHandler);
	}

	deactivateInternal() {
		this.game.viewBoxSize.removeOnChangeListener(this.onViewBoxChangeHandler);
		this.draw.remove();
		this.draw = null;
		Pixies.destroyElement(this.canvas);
		this.canvas = null;
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
