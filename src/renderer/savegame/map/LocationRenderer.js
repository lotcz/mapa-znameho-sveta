import SvgRenderer from "../../basic/SvgRenderer";

export default class LocationRenderer extends SvgRenderer {
	helper;

	/**
	 * @type LocationModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);
		this.model = model;

		this.addAutoEvent(this.game.isInDebugMode, 'change', () => this.updateHelper(), true);
	}

	activateInternal() {
		this.group = this.draw.group();
		this.group.on('click', () => this.game.saveGame.get().currentLocationId.set(this.model.id.get()));
		this.labelGroup = this.group.group();
		this.updateLabel()
	}

	deactivateInternal() {
		this.group.remove();
		if (this.helper) {
			this.helper.remove();
		}
	}

	renderInternal() {
		if (this.model.coordinates.isDirty) {
			if (this.helper) {
				this.helper.center(this.model.coordinates.x, this.model.coordinates.y);
				this.helperLabel.center(this.model.coordinates.x, this.model.coordinates.y - 25);
			}
			this.labelGroup.center(this.model.coordinates.x, this.model.coordinates.y);
		}
		if (this.model.name.isDirty) {
			this.updateLabel();
		}
	}

	updateHelper() {
		if (this.helper) {
			this.helper.remove();
			this.helperLabel.remove();
		}
		if (this.game.isInDebugMode.get()) {
			this.helper = this.draw.circle(35)
				.center(this.model.coordinates.x, this.model.coordinates.y)
				.stroke({width: '2px', color: 'purple'})
				.fill('rgba(200, 100, 100, 0.3)')
				.css({cursor: 'move'})
				.on('mouseover', () => this.game.triggerEvent('helperMouseOver', this.model.coordinates))
				.on('mouseout', () => this.game.triggerEvent('helperMouseOut', this.model.coordinates));

			this.helperLabel = this.draw.text(this.model.id.get())
				.font({ fill: 'white', size: 25})
				.center(this.model.coordinates.x, this.model.coordinates.y - 25);
		}
	}

	updateLabel() {
		if (this.label) {
			this.label.remove();
		}

		const text = this.model.name.get();

		this.label = this.labelGroup.text(text)
			.font({ fill: '#311a0a', size: 45, family: 'Vollkorn' })
			.center(this.model.coordinates.x, this.model.coordinates.y - 30)
			.hide();

		this.dot = this.labelGroup.circle(25)
			.center(this.model.coordinates.x, this.model.coordinates.y)
			.fill('#311a0a')
			.on('mouseover', () => this.label.show())
			.on('mouseout', () => this.label.hide());

	}

}
