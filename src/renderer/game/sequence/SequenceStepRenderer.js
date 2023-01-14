import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class SequenceStepRenderer extends DomRenderer {

	/**
	 * @type SequenceStepModel
	 */
	model;

	constructor(game, model, bg, text) {
		super(game, model, bg);

		this.model = model;
		this.bg = bg;
		this.text = text;
	}

	activateInternal() {
		if (this.model.image.isSet()) {
			this.game.assets.getAsset(this.model.image.get(), (img) => {
				const image = Pixies.createElement(this.bg, 'img', 'container');
				image.style.objectFit = 'cover';
				image.style.height = '100%';
				image.src = img.src;
			});
		}

		if ( this.model.text.isSet()) {
			Pixies.emptyElement(this.text);
			Pixies.removeClass(this.text, 'fading-out');
			Pixies.createElement(this.text,'div', null, this.model.text.get());
		} else {
			Pixies.addClass(this.text, 'fading-out');
		}
	}

	deactivateInternal() {
		//this.removeElement(this.container);
	}

}
