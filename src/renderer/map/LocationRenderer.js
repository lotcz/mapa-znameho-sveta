import SvgRenderer from "../basic/SvgRenderer";

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
	}

	deactivateInternal() {
		this.group.remove();
	}

	createHelperPoint() {
		return this.group.circle(35)
			.center(this.model.coordinates.x, this.model.coordinates.y)
			.stroke({width: '2px', color: 'purple'})
			.fill('rgba(200, 100, 100, 0.3)')
			.css({ cursor: 'move'})
			.on('mouseover', () => this.game.triggerEvent('helperMouseOver', this.model.coordinates))
			.on('mouseout', () => this.game.triggerEvent('helperMouseOut', this.model.coordinates));
	}

	renderInternal() {
		if (this.model.coordinates.isDirty) {
			this.helper.center(this.model.coordinates.x, this.model.coordinates.y);
		}
	}

}
