import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import StatBarRenderer from "../party/stats/StatBarRenderer";
import DirtyValueRenderer from "../../basic/DirtyValueRenderer";

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

		const bottom = Pixies.createElement(this.container, 'div', 'bottom col p-2');
		const sympathy = Pixies.createElement(bottom, 'div', 'sympathy stat-wrapper');

		this.addChild(
			new StatBarRenderer(
				this.game,
				this.model.stats.sympathyTowardsParty,
				sympathy
			)
		);

		this.addChild(
			new DirtyValueRenderer(
				this.game,
				this.model.stats.sympathyTowardsParty.currentFloat,
				bottom
			)
		);

		this.addChild(
			new DirtyValueRenderer(
				this.game,
				this.model.stats.isAggressive,
				bottom
			)
		);

		this.game.assets.getAsset(
			this.model.portrait.get(),
			(img) => {
				pic.appendChild(img);
			}
		);

	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
