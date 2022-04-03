import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import MapRenderer from "./MapRenderer";

export default class GameRenderer extends DomRenderer {

	/**
	 * @type GameModel
	 */
	model;

	constructor(model, dom) {
		super(model, model, dom);

		this.model = model;

		this.addClass('game');

		this.mapLayer = this.addElement('div', 'map');
		this.mapRenderer = this.addChild(new MapRenderer(this.game, this.model.map, this.mapLayer));

		Pixies.destroyElement(document.getElementById('initial_loading'));
	}

}
