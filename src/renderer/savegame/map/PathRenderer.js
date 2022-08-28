import SvgRenderer from "../../basic/SvgRenderer";

export default class PathRenderer extends SvgRenderer {

	group;

	path;

	/**
	 * @type PathModel
	 */
	model;

	constructor(game, model, svg) {
		super(game, model, svg);
		this.model = model;

	}

	activateInternal() {
		this.group = this.draw.group();
		this.renderPath();
	}

	deactivateInternal() {
		this.group.remove();
	}

	renderInternal() {
		if (this.model.waypoints.isDirty) {
			this.renderPath();
		}
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

		this.path = this.group.path(path).stroke({color: 'rgba(25, 25, 25, 0.8)', width: '1px', linecap: 'round', linejoin: 'round'}).fill('transparent');
		this.path.on('click', (e) => {
			this.model.triggerEvent('path-clicked');
		});

		this.model.triggerEvent('path-length', this.path.length());
	}

}
