import SvgRenderer from "../../basic/SvgRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";
import ConnectionRenderer from "./ConnectionRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class CurrentLocationRenderer extends SvgRenderer {

	/**
	 * @type LocationModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);
		this.model = model;

		this.addChild(new CollectionRenderer(this.game, this.model.connections, (m) => new ConnectionRenderer(this.game, m, this.draw)));
	}

	activateInternal() {
		const biotopeIds = [this.model.biotopeId.get()];
		const pathIds = this.model.connections.map((conn) => conn.pathId.get());
		const paths = pathIds.map((id) => this.game.resources.map.paths.getById(id)).filter((p) => p);
		paths.forEach((p) => biotopeIds.push(p.biotopeId.get()));
		const biotopes = Pixies.arrayUnique(biotopeIds).map((id) => this.game.resources.map.biotopes.getById(id)).filter((b) => b);
		const resources = [];
		biotopes.forEach((b) => resources.push(...b.getResourcesForPreload()));
		this.game.assets.preload(Pixies.arrayUnique(resources));
	}
}
