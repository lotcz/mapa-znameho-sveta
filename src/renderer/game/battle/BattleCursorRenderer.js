import SvgRenderer from "../../basic/SvgRenderer";

export default class BattleCursorRenderer extends SvgRenderer {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;
		this.group = null;
	}

	activateInternal() {
		this.group = this.draw.group();
		const size = this.model.battleMap.get().tileSize.get() * 0.85;
		const width = 3;
		this.circle = this.group.ellipse(size, size / 2);
		this.circle.fill('rgba(0, 0, 0, 0)');
		this.circle.stroke({width: width, color: 'rgba(255, 255, 255, 1)'});
		this.updateCursor();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	renderInternal() {
		if (this.model.isMouseOver.isDirty) {
			if (this.model.isMouseOver.get()) {
				this.group.show();
			} else {
				this.group.hide();
			}
		}
		if (this.model.isMouseOver.get()) {
			if (this.model.mouseHoveringTile.isDirty) {
				this.updateCursor();
			}
		}
	}

	updateCursor() {
		const battleMap = this.model.battleMap.get();
		const tileCoords = battleMap.positionToScreenCoords(this.model.mouseHoveringTile);
		this.group.center(tileCoords.x, tileCoords.y);
	}

}
