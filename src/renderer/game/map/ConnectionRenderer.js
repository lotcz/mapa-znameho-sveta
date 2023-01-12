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

		this.saveGame = this.game.saveGame.get();
		this.addAutoEvent(this.saveGame.animationSequence, 'change', () => this.renderArrow());
	}

	activateInternal() {
		this.group = this.draw.group();
		this.group.opacity(0.5);
		this.group.on('mouseover', () => {
			this.group.opacity(1);
		});
		this.group.on('mouseout', () => {
			this.group.opacity(0.5);
		});
		this.group.on('click', () => {
			this.model.triggerEvent('connection-selected', this.model);
		});

		this.loadImageRef('img/icon/arrow.svg', (image) => {
			if (!this.group) {
				console.log('no group available');
				return;
			}
			this.arrow = this.group.use(image);
			this.arrow.scale(8);
			this.renderArrow();
		});
	}

	deactivateInternal() {
		this.group.remove();
	}

	renderInternal() {
		this.renderArrow();
	}

	renderArrow() {
		if (!this.arrow) {
			console.log('no arrow created');
			return;
		}
		if (this.saveGame.animationSequence.isSet()) {
			this.group.hide();
			return;
		} else {
			this.group.show();
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
