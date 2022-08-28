import SvgRenderer from "../../basic/SvgRenderer";

export default class ConnectionRenderer extends SvgRenderer {

	group;

	/**
	 * @type ConnectionModel
	 */
	model;

	constructor(game, model, svg) {
		super(game, model, svg);

		this.model = model;

		this.lastRotation = 0;
	}

	activateInternal() {
		this.group = this.draw.group();

		const token = 'party-arrow';
		if (!this.refExists(token)) {
			this.game.assets.getAsset(
				'img/arrow.svg',
				(img) => {
					if (!this.refExists(token)) {
						const marker = this.getDefs().image(img.src, () => this.createArrow());
						this.setRef(token, marker);
					} else {
						this.createArrow();
					}
				}
			);
		} else {
			this.createArrow();
		}
	}

	deactivateInternal() {
		this.group.remove();
	}

	renderInternal() {
		this.renderArrow();
	}

	createArrow() {
		if (!this.group) {
			console.log('no group available');
			return;
		}
		this.arrow = this.group.use(this.getRef('party-arrow'));
		this.arrow.scale(8);
		this.renderArrow();
	}

	renderArrow() {
		if (!this.arrow) {
			console.log('no arrow created');
			return;
		}
		const diff = this.model.direction.subtract(this.model.location.coordinates);
		diff.setSize(120);
		const pos = this.model.location.coordinates.add(diff);
		const rotation = this.model.location.coordinates.getRotationFromYAxis(pos).add(Math.PI);

		this.group.center(pos.x, pos.y);
		this.arrow.rotate( - (rotation.getDegrees() - this.lastRotation));
		this.lastRotation = rotation.getDegrees();
	}

}
