import {
	SPECIAL_TYPE_BLOCK,
	SPECIAL_TYPE_EXIT,
	SPECIAL_TYPE_SPAWN
} from "../../../model/game/battle/battlemap/BattleSpecialModel";
import SvgRendererWithBattle from "../../basic/SvgRendererWithBattle";

export default class BattleSpecialRenderer extends SvgRendererWithBattle {

	/**
	 * @type BattleSpecialModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;
		this.group = null;

		this.helperLabel = null;
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

		this.size = this.battleMap.tileSize.get();
		this.circle = this.group.ellipse(this.size, this.size / 2).stroke({width: 5, color:  color});

		this.updatePosition();
		this.updateDataHelper();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	renderInternal() {
		if (this.model.position.isDirty) {
			this.updatePosition();
		}
		if (this.model.data.isDirty) {
			this.updateDataHelper();
		}
	}

	updatePosition() {
		const coords = this.battleMap.positionToScreenCoords(this.model.position);
		this.group.center(coords.x, coords.y);
		this.updateDataHelperPosition();
	}

	updateDataHelper() {
		if (this.helperLabel) {
			this.helperLabel.remove();
			this.helperLabel = null;
		}
		if (this.model.data.isSet()) {
			this.helperLabel = this.group.plain(this.model.data.get())
				.font({ fill: 'white', size: 25});
			this.updateDataHelperPosition();
		}
	}

	updateDataHelperPosition() {
		if (this.helperLabel) {
			const coords = this.battleMap.positionToScreenCoords(this.model.position);
			this.helperLabel.center(coords.x, coords.y);
		}
	}

}
