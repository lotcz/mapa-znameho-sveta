import DomRenderer from "./DomRenderer";

export default class ImageRenderer extends DomRenderer {

	/**
	 * @type DirtyValue
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
	}

	activateInternal() {
		this.renderImage();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		this.renderImage();
	}

	renderImage() {
		this.removeElement(this.container);
		let portraitUri = this.model.get();
		if (typeof portraitUri !== 'string' || portraitUri.length === 0) {
			console.log(portraitUri);
			return;
		}
		this.game.assets.getAsset(portraitUri, (img) => {
			this.container = img.cloneNode(true);
			this.dom.appendChild(this.container);
		});
	}
}
