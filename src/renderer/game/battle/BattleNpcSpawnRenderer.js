import SvgRendererWithBattle from "../../basic/SvgRendererWithBattle";

export default class BattleNpcSpawnRenderer extends SvgRendererWithBattle {

	/**
	 * @type BattleNpcSpawnModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;
		this.group = null;

	}

	activateInternal() {
		this.group = this.draw.group();

		const color = 'orange';
		const size = this.battleMap.tileSize.get();
		this.circle = this.group.ellipse(size, size / 2).stroke({width: 5, color:  color});

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
		if (this.model.characterTemplateId.isDirty) {
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
		if (this.model.characterTemplateId.isSet()) {
			this.helperLabel = this.group.plain(this.model.characterTemplateId.get())
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
