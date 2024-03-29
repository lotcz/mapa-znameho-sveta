import Pixies from "../../../../class/basic/Pixies";
import StatNumberRenderer from "./StatNumberRenderer";
import StatNameRenderer from "./StatNameRenderer";
import NullableNodeRenderer from "../../../basic/NullableNodeRenderer";
import DomRendererWithSaveGame from "../../../basic/DomRendererWithSaveGame";

export default class StatCombatRenderer extends DomRendererWithSaveGame {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'stat-wrapper column flex-1 p-1');
		this.container.addEventListener('mouseover', () => {
			this.saveGame.triggerEvent('stat-hover', this.model);
		});
		this.container.addEventListener('mouseout', () => {
			this.saveGame.triggerEvent('stat-hover', null);
		});

		this.name = Pixies.createElement(this.container, 'div', 'stat-name center mb-1');
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.definition,
				(m) => new StatNameRenderer(this.game, m, this.name)
			)
		);

		this.bottom = Pixies.createElement(this.container, 'div', 'column center');
		this.numeric = Pixies.createElement(this.bottom, 'div', 'stat-badge row center');
		this.addChild(new StatNumberRenderer(this.game, this.model.currentFloat, this.numeric));
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
