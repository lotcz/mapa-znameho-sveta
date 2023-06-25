import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class ItemTooltipRenderer extends DomRenderer {

	/**
	 * @type ItemModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;


	}

	activateInternal() {
		const defId = this.model.definitionId.get();
		const itemDef = this.game.resources.itemDefinitions.getById(defId);
		if (!itemDef) {
			console.error(`Item definition ${defId} not found`);
			return;
		}

		this.container = this.addElement('div', 'tooltip-item col');
		const top = Pixies.createElement(this.container, 'div', 'top col center');
		const name = Pixies.createElement(top, 'h3', 'name pt-1', itemDef.name.get());

		const pic = Pixies.createElement(this.container, 'div', 'picture col center');

		this.game.assets.getAsset(`itm/${defId}`, (img) => {
			pic.appendChild(img);
		});

		if (itemDef.statEffects.isEmpty()) return;

		const bottom = Pixies.createElement(this.container, 'div', 'bottom col p-1 center');
		itemDef.statEffects.forEach(
			(se) => {
				const sd = this.game.resources.statDefinitions.getById(se.statId.get())
				const steff = Pixies.createElement(bottom, 'div', 'row');
				Pixies.createElement(steff, 'div', 'px-1', sd.name.get());
				const amount = se.amount.get();
				Pixies.createElement(steff, 'div', 'px-1', amount > 0 ? `+${amount}` : amount);
			}
		)


	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
