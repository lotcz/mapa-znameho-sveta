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
		const width = size / 25;
		this.circle = this.group.ellipse(size - (2 * width), (size / 2) - (2 * width));
		this.circle.fill('transparent').stroke({width: width, color: 'white'});
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
