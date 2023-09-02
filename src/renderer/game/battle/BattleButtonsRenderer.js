import DomRendererWithBattle from "../../basic/DomRendererWithBattle";
import ConditionalNodeRenderer from "../../basic/ConditionalNodeRenderer";
import BattleFightingMenuRenderer from "./BattleFightingMenuRenderer";
import BattleExploringMenuRenderer from "./BattleExploringMenuRenderer";

export default class BattleButtonsRenderer extends DomRendererWithBattle {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.battle.isFighting,
				() => this.battle.isFighting.get(),
				() => new BattleFightingMenuRenderer(this.game, model, this.container),
				() => new BattleExploringMenuRenderer(this.game, model, this.container)
			)
		);

	}

	activateInternal() {
		this.container = this.addElement('div', 'battle-buttons map-menu column');
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
