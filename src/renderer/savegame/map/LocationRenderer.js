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
			}
			this.updateLabel();
		}
		if (this.model.name.isDirty) {
			this.updateLabel();
		}
	}

	updateHelper() {
		if (this.helper) {
			this.helper.remove();
		}
		if (this.game.isInDebugMode.get()) {
			this.helper = this.draw.circle(35)
				.center(this.model.coordinates.x, this.model.coordinates.y)
				.stroke({width: '2px', color: 'purple'})
				.fill('rgba(200, 100, 100, 0.3)')
				.css({cursor: 'move'})
				.on('mouseover', () => this.game.triggerEvent('helperMouseOver', this.model.coordinates))
				.on('mouseout', () => this.game.triggerEvent('helperMouseOut', this.model.coordinates));
		}
	}

	updateLabel() {
		if (this.label) {
			this.label.remove();
		}
		const text = this.model.id.get() + ' - ' + this.model.name.get();

		this.label = this.labelGroup.text(text)
			.font({ fill: '#311a0a', size: 25, family: 'Vollkorn' })
			.center(this.model.coordinates.x, this.model.coordinates.y - 30);
	}

}
