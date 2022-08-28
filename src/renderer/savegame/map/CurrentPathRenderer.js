import SvgRenderer from "../../basic/SvgRenderer";
import Vector2 from "../../../model/basic/Vector2";
import CollectionRenderer from "../../basic/CollectionRenderer";
import WaypointRenderer from "./WaypointRenderer";

export default class CurrentPathRenderer extends SvgRenderer {

	group;

	path;

	/**
	 * @type PathModel
	 */
	model;

	constructor(game, model, svg) {
		super(game, model, svg);
		this.model = model;

		this.waypointsRenderer = null;

		this.addAutoEvent(
			this.game.isInDebugMode,
			'change',
			() => {
				if (this.waypointsRenderer) {
					this.removeChild(this.waypointsRenderer);
					this.waypointsRenderer = null;
				}
				if (this.game.isInDebugMode.get()) {
					this.waypointsRenderer = this.addChild(new CollectionRenderer(this.game, this.model.waypoints, (model) => new WaypointRenderer(this.game, model, this.groupFg)));
				}
				this.renderPath();
			},
			true
		);
	}

	activateInternal() {
		this.group = this.draw.group();
		this.groupBg = this.group.group();
		this.groupFg = this.group.group();
		this.renderPath();
		this.renderMarker();
	}

	deactivateInternal() {
		this.group.remove();
	}

	renderInternal() {
		if (this.model.waypoints.isDirty) {
			this.renderPath();
		}
		this.renderMarker();
	}

	renderPath() {
		if (this.path) {
			this.path.remove();
		}
		if (this.model.waypoints.count() < 2) {
			return;
		}
		if (!this.game.isInDebugMode.get()) {
			return;
		}
		const waypoints = this.model.waypoints.children.items;
		const first = waypoints[0];
		let path = `M ${first.coordinates.x} ${first.coordinates.y} `;
		let prev = first;
		for (let i = 1, max = waypoints.length; i < max; i++) {
			const wp = waypoints[i];
			path += `C ${prev.a.x} ${prev.a.y} ${wp.b.x} ${wp.b.y} ${wp.coordinates.x} ${wp.coordinates.y} `;
			prev = wp;
		}

		this.path = this.groupBg.path(path).stroke({color: 'rgba(255, 255, 255, 0.8)', width: '8px', linecap: 'round', linejoin: 'round'}).fill('transparent');
		this.model.triggerEvent('path-length', this.path.length());
	}

	renderMarker() {
		if (!this.path) {
			return;
		}
		const pos = this.path.pointAt(this.model.pathProgress.get());
		this.model.triggerEvent('path-marker-position', new Vector2(pos.x, pos.y));
	}

}
