import SvgRenderer from "../../basic/SvgRenderer";

export default class BattleCharacterTargetRenderer extends SvgRenderer {

	/**
	 * @type Vector2
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
		const size = this.battleMap.tileSize.get();
		this.circle = this.group.ellipse(size - 8, (size / 2) - 8);
		this.circle.fill('transparent').stroke({width: 3, color: 'white'});
		this.updatePosition();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	renderInternal() {
		this.updatePosition();
	}

	updatePosition() {
		const tileCoords = this.battleMap.positionToScreenCoords(this.model);
		this.group.center(tileCoords.x, tileCoords.y);
	}
}
