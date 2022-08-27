import SvgRenderer from "../../basic/SvgRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";
import WaypointRenderer from "./WaypointRenderer";
import Vector2 from "../../../model/basic/Vector2";

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

		this.onDebugModeUpdatedHandler = () => this.updateDebugMode();
	}

	activateInternal() {
		this.groupBg = this.draw.group();
		this.groupFg = this.draw.group();

		const token = 'marker';
		if (!this.refExists(token)) {
			this.game.assets.getAsset(
				'img/marker.svg',
				(img) => {
					if (!this.refExists(token)) {
						const marker = this.getDefs().image(img.src);
						this.setRef(token, marker);
						if (this.model.isCurrentPath.get()) {
							this.renderMarker();
						}
					}
				}
			);
		}

		this.renderPath();

		this.updateDebugMode();
		this.game.isInDebugMode.addOnChangeListener(this.onDebugModeUpdatedHandler);
	}

	deactivateInternal() {
		this.removeChild(this.waypointsRenderer);
		this.groupBg.remove();
		this.groupFg.remove();
		this.game.isInDebugMode.removeOnChangeListener(this.onDebugModeUpdatedHandler);
	}

	renderInternal() {
		if (this.model.waypoints.isDirty) {
			this.renderPath();
		}
		if (this.model.isCurrentPath.get()) {
			this.renderMarker();
		} else if (this.marker) {
			this.hideMarker();
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
		this.path.on('click', (e) => {
			this.model.triggerEvent('path-clicked');
		});

		this.model.triggerEvent('path-length', this.path.length());
	}

	renderMarker() {
		if (!this.path) {
			return;
		}
		if (!this.marker) {
			this.marker = this.groupFg.group();
			const img = this.marker.use(this.getRef('marker'));
			img.scale(3);
		}
		const pos = this.path.pointAt(this.game.saveGame.get().pathProgress.get());
		this.marker.center(pos.x, pos.y);

		this.model.triggerEvent('path-marker-position', new Vector2(pos.x, pos.y));
	}

	hideMarker() {
		if (this.marker) {
			this.marker.remove();
			this.marker = null;
		}
	}

	updateDebugMode() {
		if (this.waypointsRenderer) {
			this.removeChild(this.waypointsRenderer);
			this.waypointsRenderer = null;
		}
		if (this.game.isInDebugMode.get()) {
			this.waypointsRenderer = this.addChild(new CollectionRenderer(this.game, this.model.waypoints, (model) => new WaypointRenderer(this.game, model, this.groupFg)));
		}
	}

}
