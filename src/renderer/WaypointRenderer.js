import SvgRenderer from "./SvgRenderer";

export default class WaypointRenderer extends SvgRenderer {

	/**
	 * @type WaypointModel
	 */
	model;

	helperMain;
	helperA;
	lineA;
	helperB;
	lineB;

	constructor(game, model, svg) {
		super(game, model, svg);
		this.model = model;
	}

	activateInternal() {
		this.group = this.draw.group();
		this.helperMain = this.createHelperPoint(this.model.coordinates, 20, 'red');
		this.helperA = this.createHelperPoint(this.model.a, 15, 'green');
		this.lineA = this.group.line(this.model.coordinates.x, this.model.coordinates.y, this.model.a.x, this.model.a.y).stroke({color: 'green',width: '2px'});
		this.helperB = this.createHelperPoint(this.model.b, 15, 'blue');
		this.lineB = this.group.line(this.model.coordinates.x, this.model.coordinates.y, this.model.b.x, this.model.b.y).stroke({color: 'blue',width: '2px'});
	}

	deactivateInternal() {
		this.group.remove();
	}

	renderInternal() {
		this.updateHelperPoint(this.helperMain, this.model.coordinates);
		this.updateHelperPoint(this.helperA, this.model.a);
		this.updateHelperLine(this.lineA, this.model.coordinates, this.model.a);
		this.updateHelperPoint(this.helperB, this.model.b);
		this.updateHelperLine(this.lineB, this.model.coordinates, this.model.b);
	}

	createHelperPoint(v, size, color) {
		return this.group.circle(size).center(v.x, v.y).fill(color).css({ cursor: 'move'})
			.on('mouseover', () => this.game.triggerEvent('helperMouseOver', v))
			.on('mouseout', () => this.game.triggerEvent('helperMouseOut', v));
	}

	updateHelperPoint(helper, v) {
		helper.center(v.x, v.y);
	}

	updateHelperLine(helper, a, b) {
		helper.plot(a.x, a.y, b.x, b.y);
	}

}
