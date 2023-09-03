import SvgRendererWithBattle from "../../basic/SvgRendererWithBattle";

export class BattleRingStyle {
	/**
	 * @type string|color|null
	 */
	ringColor;

	/**
	 * @type string|color|null
	 */
	fillColor;

	/**
	 * @type string|color|null
	 */
	radialColor;

	constructor(ringColor = 'rgba(255, 255, 255)', fillColor = null, radialColor = null) {
		this.ringColor = ringColor;
		this.fillColor = fillColor;
		this.radialColor = radialColor;
	}
}

export default class BattleRingRenderer extends SvgRendererWithBattle {

	/**
	 * @type Vector2
	 */
	model;

	/**
	 * @type BattleRingStyle
	 */
	style;

	constructor(game, model, draw, style = new BattleRingStyle()) {
		super(game, model, draw);

		this.model = model;
		this.style = style;
		this.group = null;
	}

	activateInternal() {
		this.group = this.draw.group();
		const size = this.battleMap.tileSize.get() * 0.85;
		const width = size * 0.025;
		this.circle = this.group.ellipse(size - (2 * width), (size / 2) - (2 * width));

		if (this.style.ringColor !== null) {
			this.circle.stroke({width: width, color: this.style.ringColor});
		}

		if (this.style.fillColor !== null) {
			if (this.style.radialColor != null) {
				this.radial = this.draw.gradient(
					'radial',
					(add) => {
						add.stop(0, this.style.radialColor);
						add.stop(0.3, this.style.fillColor);
						add.stop(1, this.style.ringColor);
					}
				);
				this.circle.fill(this.radial);
			} else {
				this.circle.fill(this.style.fillColor);
			}
		} else {
			this.circle.fill('transparent');
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
