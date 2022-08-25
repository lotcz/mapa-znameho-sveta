import SvgRenderer from "../basic/SvgRenderer";
import {WAYPOINT_TYPE_END, WAYPOINT_TYPE_START} from "../../model/resources/WaypointModel";

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
		this.helperMain = this.createHelperPoint(this.model.coordinates, 30, 'red');

		this.updateType();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	renderInternal() {
		if (this.model.type.isDirty) {
			this.updateType();
		}
		this.updateHelperPoint(this.helperMain, this.model.coordinates);
		this.updateHelperPoint(this.helperA, this.model.a);
		this.updateHelperLine(this.lineA, this.model.coordinates, 30, this.model.a, 25);
		this.updateHelperPoint(this.helperB, this.model.b);
		this.updateHelperLine(this.lineB, this.model.coordinates, 30, this.model.b, 25);
	}

	updateType() {
		if (this.model.type.equalsTo(WAYPOINT_TYPE_END)) {
			if (this.lineA) {
				this.lineA.remove();
				this.lineA = null;
			}
			if (this.helperA) {
				this.helperA.remove();
				this.helperA = null;
			}
		} else {
			if (!this.lineA) this.lineA = this.group.line(this.model.coordinates.x, this.model.coordinates.y, this.model.a.x, this.model.a.y).stroke({color: 'green',width: '2px'});
			if (!this.helperA) this.helperA = this.createHelperPoint(this.model.a, 25, 'green');
		}
		if (this.model.type.equalsTo(WAYPOINT_TYPE_START)) {
			if (this.lineB) {
				this.lineB.remove();
				this.lineB = null;
			}
			if (this.helperB) {
				this.helperB.remove();
				this.helperB = null;
			}
		} else {
			if (!this.lineB) this.lineB = this.group.line(this.model.coordinates.x, this.model.coordinates.y, this.model.b.x, this.model.b.y).stroke({color: 'blue',width: '2px'});
			if (!this.helperB) this.helperB = this.createHelperPoint(this.model.b, 25, 'blue');
		}
	}

	createHelperPoint(v, size, color) {
		return this.group.circle(size)
			.center(v.x, v.y)
			.stroke({width: '2px', color: color})
			.fill('rgba(200, 200, 200, 0.3)')
			.css({ cursor: 'move'})
			.on('mouseover', () => this.game.triggerEvent('helperMouseOver', v))
			.on('mouseout', () => this.game.triggerEvent('helperMouseOut', v));
	}

	updateHelperPoint(helper, v) {
		if (!helper) return;
		helper.center(v.x, v.y);
	}

	updateHelperLine(helper, a, da, b, db) {
		if (!helper) return;
		const arrow = b.subtract(a);
		const start = a.add(arrow.clone().setSize(da/2));
		const end = b.subtract(arrow.clone().setSize(db/2));
		helper.plot(start.x, start.y, end.x, end.y);
	}

}
