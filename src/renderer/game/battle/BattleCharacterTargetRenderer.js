import SvgRendererWithBattle from "../../basic/SvgRendererWithBattle";

export default class BattleCharacterTargetRenderer extends SvgRendererWithBattle {

	/**
	 * @type Vector2
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;
		this.group = null;

	}

	activateInternal() {
		this.group = this.draw.group();
		const size = this.battleMap.tileSize.get() * 0.85;
		const width = 3;
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
