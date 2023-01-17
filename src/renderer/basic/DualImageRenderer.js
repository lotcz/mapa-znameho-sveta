import DomRenderer from "./DomRenderer";
import Pixies from "../../class/basic/Pixies";
import {ImageHelper} from "../../class/basic/ImageHelper";
import Vector2 from "../../model/basic/Vector2";

export default class DualImageRenderer extends DomRenderer {

	/**
	 * @type DualImageModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.imageA = null;
		this.imageB = null;

		this.addAutoEvent(
			this.model.imageA.url,
			'change',
			() => {
				this.imageA = null;
				if (this.model.imageA.url.isEmpty()) return;
				this.game.assets.getAsset(this.model.imageA.url.get(), (img) => {
					this.imageA = img;
					this.renderImages();
				});
			},
			true
		);

		this.addAutoEvent(
			this.model.imageB.url,
			'change',
			() => {
				this.imageB = null;
				if (this.model.imageB.url.isEmpty()) return;
				this.game.assets.getAsset(this.model.imageB.url.get(), (img) => {
					this.imageB = img;
					this.renderImages();
				});
			},
			true
		);

		this.addAutoEvent(
			this.model.size,
			'change',
			() => {
				this.canvas.width = this.model.size.x;
				this.canvas.height = this.model.size.y;
				this.renderImages();
			},
			true
		);

	}

	activateInternal() {
		this.canvas = Pixies.createElement(this.dom, 'canvas');
		this.context2d = this.canvas.getContext('2d');
		this.renderImages();
	}

	deactivateInternal() {
		this.removeElement(this.canvas);
		this.context2d = null;
	}

	renderInternal() {
		this.renderImages();
	}

	renderImages() {
		if (!this.context2d) {
			console.log('no canvas context for rendering');
			return;
		}

		this.context2d.clearRect(0, 0,this.model.size.x, this.model.size.y);

		this.renderImage(this.imageA, this.model.imageA);
		this.renderImage(this.imageB, this.model.imageB);
	}

	renderImage(image, model) {
		if (!image) return;

		this.context2d.globalAlpha = model.opacity.get();
		const imageSize = new Vector2(image.width, image.height);
		const zoom = ImageHelper.sanitizeZoom(
			imageSize,
			this.model.size,
			model.zoom.get()
		);
		const center = ImageHelper.sanitizeCenter(
			imageSize,
			this.model.size,
			zoom,
			model.coordinates
		);
		const viewSize = this.model.size.multiply(1/zoom);
		const corner = center.subtract(viewSize.multiply(0.5));
		this.context2d.drawImage(
			image,
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
}
