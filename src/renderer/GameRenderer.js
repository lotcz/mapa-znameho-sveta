import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import MapRenderer from "./MapRenderer";
import ThreeRenderer from "./ThreeRenderer";

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

		this.threeLayer = this.addElement('div', 'three');
		this.threeRenderer = this.addChild(new ThreeRenderer(this.game, this.model.three, this.threeLayer));

		Pixies.destroyElement(document.getElementById('initial_loading'));
	}

}
