import SvgRendererWithBattle from "../../basic/SvgRendererWithBattle";

export default class BattleRingRenderer extends SvgRendererWithBattle {

	/**
	 * @type Vector2
	 */
	model;

	constructor(game, model, draw, color = 'white', fill = 'transparent') {
		super(game, model, draw);

		this.model = model;
		this.fill = fill;
		this.color = color;
		this.group = null;
	}

	activateInternal() {
		this.group = this.draw.group();
		const size = this.battleMap.tileSize.get() * 0.85;
		const width = size * 0.025;
		this.circle = this.group.ellipse(size - (2 * width), (size / 2) - (2 * width));
		this.circle.stroke({width: width, color: this.color});

		if (this.fill === 'radial') {
			this.radial = this.draw.gradient(
				'radial',
				function (add) {
					add.stop(0, 'rgba(0, 0, 0, 0)');
					add.stop(0.3, 'rgba(155, 155, 155, 0)');
					add.stop(1, 'rgba(255, 255, 255, 1)');
				}
			);
			this.circle.fill(this.radial);
		} else {
			this.circle.fill(this.fill);
		}

		this.updatePosition();
	}

	deactivateInternal() {
		if (this.radial) {
			this.radial.remove();
			this.radial = null;
		}
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
