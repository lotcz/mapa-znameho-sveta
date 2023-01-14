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

		this.addAutoEvent(
			this.model,
			'fade-out',
			() => {
				Pixies.addClass(this.bg, 'fading-out');
				Pixies.addClass(this.text, 'fading-out');
			}
		);
	}

	activateInternal() {
		Pixies.emptyElement(this.bg);
		Pixies.emptyElement(this.text);
		Pixies.removeClass(this.bg, 'fading-out');
		Pixies.removeClass(this.text, 'fading-out');

		if (this.model.image.isSet()) {
			this.game.assets.getAsset(this.model.image.get(), (img) => {
				const image = Pixies.createElement(this.bg, 'img', 'container');
				image.src = img.src;
			});
		}

		if (this.model.text.isSet()) {
			Pixies.createElement(this.text,'div', null, this.model.text.get());
		}
	}

}
