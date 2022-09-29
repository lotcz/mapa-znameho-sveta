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

		this.addAutoEvent(
			this.game.mainLayerMouseCoordinates,
			'change',
			() => {
				if (this.model.isMouseOver.get()) {
					this.updateCursor();
				}
			},
			true
		);
	}

	activateInternal() {
		this.group = this.draw.group();
		const size = this.model.battleMap.get().tileSize.get();
		this.circle = this.group.circle(size);
		this.circle.fill('rgba(255, 0, 0, 0.5)').stroke({width: 0});
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
	}

	updateCursor() {
		const corner = this.model.coordinates.subtract(this.game.mainLayerSize.multiply(0.5 / this.model.zoom.get()));
		const coords = corner.add(this.game.mainLayerMouseCoordinates.multiply(1 / this.model.zoom.get()));
		const battleMap = this.model.battleMap.get();
		const tile = battleMap.screenCoordsToTile(coords);
		if (battleMap.isTileBlocked(tile)) {
			this.group.show();
			this.group.center(coords.x, coords.y);
		} else {
			this.group.hide();
		}
	}

}
