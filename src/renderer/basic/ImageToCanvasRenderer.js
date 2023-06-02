import DomRenderer from "./DomRenderer";
import Pixies from "../../class/basic/Pixies";
import {ImageHelper} from "../../class/basic/ImageHelper";
import Vector2 from "../../model/basic/Vector2";

export default class ImageToCanvasRenderer extends DomRenderer {

	/**
	 * @type ImageModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.image = null;
	}

	activateInternal() {
		this.canvas = Pixies.createElement(this.dom, 'canvas');
		this.context2d = this.canvas.getContext('2d');
		this.updateSize();
		this.reloadImage();
	}

	deactivateInternal() {
		this.removeElement(this.canvas);
		this.context2d = null;
	}

	renderInternal() {
		if (this.model.size.isDirty) {
			this.updateSize();
		}
		if (this.model.url.isDirty) {
			this.reloadImage();
			return;
		}
		this.renderImage();
	}

	renderImage() {
		if (!(this.image && this.context2d)) return;
		this.context2d.clearRect(0, 0,this.model.size.x, this.model.size.y);
		this.context2d.globalAlpha = this.model.opacity.get();
		const imageSize = new Vector2(this.image.width, this.image.height);
		const zoom = ImageHelper.sanitizeZoom(
			imageSize,
			this.model.size,
			this.model.zoom.get()
		);

		this.model.zoom.set(zoom);

		const center = ImageHelper.sanitizeCenter(
			imageSize,
			this.model.size,
			zoom,
			this.model.coordinates
		);

		this.model.coordinates.set(center);

		const viewSize = this.model.size.multiply(1/zoom);
		const corner = center.subtract(viewSize.multiply(0.5));
		this.context2d.drawImage(
			this.image,
			corner.x,
			corner.y,
			viewSize.x,
			viewSize.y,
			0,
			0,
			this.model.size.x,
			this.model.size.y
		);
	}

	reloadImage() {
		this.image = null;
		if (this.model.url.isEmpty()) return;
		this.game.assets.getAsset(this.model.url.get(), (img) => {
			this.image = img;
			this.renderImage();
		});
	}

	updateSize() {
		this.canvas.width = this.model.size.x;
		this.canvas.height = this.model.size.y;
	}
}
