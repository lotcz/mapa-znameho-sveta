import SvgRenderer from "./SvgRenderer";
import CollectionRenderer from "./CollectionRenderer";
import WaypointRenderer from "./WaypointRenderer";
import MarkerImage from "../../res/img/marker.svg";

export default class PathRenderer extends SvgRenderer {
	group;
	path;
	marker;

	/**
	 * @type PathModel
	 */
	model;

	waypointsRenderer;

	constructor(game, model, svg) {
		super(game, model, svg);
		this.model = model;

		const token = 'marker';
		if (!this.getRef(token)) {
			const marker = this.getDefs().image(MarkerImage);
			this.setRef(token, marker);
		}
	}

	activateInternal() {
		this.groupBg = this.draw.group();
		this.groupFg = this.draw.group();
		this.waypointsRenderer = this.addChild(new CollectionRenderer(this.game, this.model.waypoints, (model) => new WaypointRenderer(this.game, model, this.groupFg)));
		this.waypointsRenderer.activate();
	}

	deactivateInternal() {
		this.removeChild(this.waypointsRenderer);
		this.groupBg.remove();
		this.groupFg.remove();
	}

	renderInternal() {
		if (this.model.waypoints.isDirty) {
			this.renderPath();
		}
		if (this.model.pathProgress.isDirty) {
			this.renderMarker();
		}
	}

	renderPath() {
		if (this.path) {
			this.path.remove();
		}
		if (this.model.waypoints.count() < 2) {
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

		this.path = this.groupBg.path(path).stroke({color: 'rgba(255, 255, 255, 0.8)', width: '5px', linecap: 'round', linejoin: 'round'}).fill('transparent');
		this.model.length.set(this.path.length());
	}

	renderMarker() {
		if (!this.path) {
			return;
		}
		if (!this.marker) {
			this.marker = this.groupFg.group();
			this.marker.use(this.getRef('marker'));
		}
		const pos = this.path.pointAt(this.model.pathProgress.get());
		this.marker.center(pos.x, pos.y);
	}

}
