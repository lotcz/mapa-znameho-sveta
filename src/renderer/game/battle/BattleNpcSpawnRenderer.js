import SvgRenderer from "../../basic/SvgRenderer";

export default class BattleNpcSpawnRenderer extends SvgRenderer {

	/**
	 * @type BattleNpcSpawnModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;
		this.group = null;

		this.battleMap = this.game.saveGame.get().currentBattle.get().battleMap.get();
	}

	activateInternal() {
		this.group = this.draw.group();

		const color = 'blue';
		const size = this.battleMap.tileSize.get();
		this.circle = this.group.ellipse(size, size / 2).stroke({width: 5, color:  color});

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
