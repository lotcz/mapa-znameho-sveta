import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class CharacterTooltipRenderer extends DomRenderer {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);
		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'tooltip-character');

		const top = Pixies.createElement(this.container, 'div', 'top col center');
		const name = Pixies.createElement(top, 'h3', 'name pt-1', this.model.name.get());

		const middle = Pixies.createElement(this.container, 'div', 'middle col center p-2');
		const pic = Pixies.createElement(middle, 'div', 'portrait');

		this.game.assets.getAsset(
			this.model.portrait.get(),
			(img) => {
				pic.appendChild(img);
			}
		);

	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
