import SvgRenderer from "../../basic/SvgRenderer";

export default class BattleSpecialRenderer extends SvgRenderer {

	/**
	 * @type BattleSpecialModel
	 */
	model;

	constructor(game, model, drawBg, drawFg) {
		super(game, model, drawBg);

		this.model = model;
		this.drawFg = drawFg;

		this.group = null;
	}

	activateInternal() {
		this.group = this.draw.group();

		this.circle = this.group.circle(50).stroke({width: 12, color: 'red'});

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
		const coords = this.game.saveGame.get().battle.get().battleMap.get().positionToScreenCoords(this.model.position);
		this.group.center(coords.x, coords.y);
	}

}
