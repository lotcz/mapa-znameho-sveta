import NullableNodeRenderer from "../../basic/NullableNodeRenderer";
import BattleCharacterTargetRenderer from "./BattleCharacterTargetRenderer";
import SvgRendererWithBattle from "../../basic/SvgRendererWithBattle";

export default class BattleCharacterRingRenderer extends SvgRendererWithBattle {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;
		this.group = null;

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.targetPosition,
				(m) => new BattleCharacterTargetRenderer(this.game, m, this.draw)
			)
		);
	}

	activateInternal() {
		this.group = this.draw.group();

		const size = this.battleMap.tileSize.get() * 0.85;
		const width = 3;
		this.circle = this.group.ellipse(size - (2 * width), (size / 2) - (2 * width));
		this.radial = this.draw.gradient(
			'radial',
			function(add) {
				add.stop(0, 'rgba(0, 255, 0, 0)');
				add.stop(0.3, 'rgba(155, 155, 155, 0)');
				add.stop(1, 'rgba(255, 255, 255, 1)');
			}
		);
		this.circle.fill(this.radial).stroke({width: width, color: 'rgba(255, 255, 255, 1)'});
		this.updatePosition();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
		this.radial.remove();
		this.radial = null;
	}

	renderInternal() {
		if (this.model.position.isDirty) {
			this.updatePosition();
		}
	}

	updatePosition() {
		const tileCoords = this.battleMap.positionToScreenCoords(this.model.position);
		this.group.center(tileCoords.x, tileCoords.y);
	}
}
