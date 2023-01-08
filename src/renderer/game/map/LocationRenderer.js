import SvgRenderer from "../../basic/SvgRenderer";

export default class LocationRenderer extends SvgRenderer {

	/**
	 * @type LocationModel
	 */
	model;

	dot;
	label;

	helperDot;
	helperLabel;

	constructor(game, model, draw) {
		super(game, model, draw);
		this.model = model;

		this.addAutoEvent(this.game.isInDebugMode, 'change', () => this.updateHelper(), true);
		this.addAutoEvent(this.model.name, 'change', () => this.updateLabel(), false);
	}

	activateInternal() {
		this.group = this.draw.group();
		this.updateDot();
		this.updateLabel()
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	renderInternal() {
		if (this.model.coordinates.isDirty) {
			this.updateDot();
			this.updateLabel();
			this.updateHelper();
		}
	}

	updateHelper() {
		if (this.helperDot) {
			this.helperDot.remove();
			this.helperDot = null;
		}
		if (this.helperLabel) {
			this.helperLabel.remove();
			this.helperLabel = null;
		}
		if (this.game.isInDebugMode.get()) {
			this.helperDot = this.group.circle(40)
				.center(this.model.coordinates.x, this.model.coordinates.y)
				.stroke({width: '2px', color: 'purple'})
				.fill('rgba(200, 100, 100, 0.3)')
				.css({cursor: 'move'})
				.on('mouseover', () => this.game.triggerEvent('helperMouseOver', this.model.coordinates))
				.on('mouseout', () => this.game.triggerEvent('helperMouseOut', this.model.coordinates))
				.on('click', () => this.game.saveGame.get().currentLocationId.set(this.model.id.get()));

			this.helperLabel = this.group.text(`${this.model.id.get()}-${this.model.name.get()}`)
				.font({ fill: 'white', size: 25})
				.center(this.model.coordinates.x, this.model.coordinates.y - 30);
		}
	}

	updateLabel() {
		if (this.label) {
			this.label.remove();
		}

		const text = this.model.name.get();

		this.label = this.group.text(text)
			.font({fill: '#311a0a', size: 45, family: 'Vollkorn'})
			.center(this.model.coordinates.x, this.model.coordinates.y - 50)
			.hide();
	}

	updateDot() {
		if (this.dot) {
			this.dot.remove();
			this.dot = null;
		}
		this.dot = this.group.circle(25)
			.center(this.model.coordinates.x, this.model.coordinates.y)
			.fill('#311a0a')
			.on('mouseover', () => this.label.show())
			.on('mouseout', () => this.label.hide());
	}

}
