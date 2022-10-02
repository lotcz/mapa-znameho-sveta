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
		const size = this.model.battleMap.get().tileSize.get();
		const width = size / 25;
		this.circle = this.group.ellipse(size - (2 * width), (size / 2) - (2 * width));
		this.circle.fill('rgba(255, 255, 255, 0.3)');
		this.circle.stroke({width: width, color: 'white'});
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
