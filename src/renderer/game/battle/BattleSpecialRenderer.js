import SvgRenderer from "../../basic/SvgRenderer";
import {
	SPECIAL_TYPE_BLOCK,
	SPECIAL_TYPE_EXIT,
	SPECIAL_TYPE_SPAWN
} from "../../../model/game/battle/battlemap/BattleSpecialModel";

export default class BattleSpecialRenderer extends SvgRenderer {

	/**
	 * @type BattleSpecialModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;
		this.group = null;
	}

	activateInternal() {
		this.group = this.draw.group();

		let color = 'red';

		switch (this.model.type.get()) {
			case SPECIAL_TYPE_BLOCK:
				color = 'gray';
				break;
			case SPECIAL_TYPE_EXIT:
				color = 'yellow';
				break;
			case SPECIAL_TYPE_SPAWN:
				color = 'blue';
				break;
		}

		this.circle = this.group.circle(50).stroke({width: 12, color:  color});

		this.updatePosition();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	renderInternal() {
		if (this.model.position.isDirty) {
			this.updatePosition();
		}
	}

	updatePosition() {
		const coords = this.game.saveGame.get().currentBattle.get().battleMap.get().positionToScreenCoords(this.model.position);
		this.group.center(coords.x, coords.y);
	}

}
