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
	}

	activateInternal() {
		this.group = this.draw.group();
		this.helper = this.createHelperPoint();
		this.labelGroup = this.group.group();
		this.updateLabel();
	}

	deactivateInternal() {
		this.group.remove();
	}

	createHelperPoint() {
		return this.draw.circle(35)
			.center(this.model.coordinates.x, this.model.coordinates.y)
			.stroke({width: '2px', color: 'purple'})
			.fill('rgba(200, 100, 100, 0.3)')
			.css({ cursor: 'move'})
			.on('mouseover', () => this.game.triggerEvent('helperMouseOver', this.model.coordinates))
			.on('mouseout', () => this.game.triggerEvent('helperMouseOut', this.model.coordinates));
	}

	updateLabel() {
		if (this.label) {
			this.label.remove();
		}
		const text = this.model.name.get();
		console.log(text);

		this.label = this.labelGroup.text(text)
			.font({ fill: '#311a0a', size: 35, family: 'Vollkorn' })
			.center(this.model.coordinates.x, this.model.coordinates.y - 40);
	}

	renderInternal() {
		if (this.model.coordinates.isDirty) {
			this.helper.center(this.model.coordinates.x, this.model.coordinates.y);
			this.updateLabel();
		}
		if (this.model.name.isDirty) {
			this.updateLabel();
		}
	}

}
