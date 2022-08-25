import DomRenderer from "./basic/DomRenderer";
import Pixies from "../class/basic/Pixies";
import EditorRenderer from "./editor/EditorRenderer";
import NullableNodeRenderer from "./basic/NullableNodeRenderer";
import SaveGameRenderer from "./SaveGameRenderer";

export default class GameRenderer extends DomRenderer {

	/**
	 * @type GameModel
	 */
	model;

	/**
	 * @type NullableNodeRenderer
	 */
	saveGameRenderer;

	constructor(model, dom) {
		super(model, model, dom);

		this.model = model;
		this.loading = null;
		this.addClass('game');

		this.editorRenderer = null;

		this.saveGameRenderer = new NullableNodeRenderer(this.game, this.model.saveGame, (model) => new SaveGameRenderer(this.game, model, this.dom));
		this.addChild(this.saveGameRenderer);

		this.updateLoadingHandler = () => this.updateLoading();
		this.updateDebugMenuHandler = () => this.updateDebugMenu();
	}

	activateInternal() {
		const initLoading = document.getElementById('initial_loading');
		if (initLoading) Pixies.destroyElement(initLoading);

		this.updateLoading();
		this.model.assets.isLoading.addOnChangeListener(this.updateLoadingHandler);

		this.updateDebugMenu();
		this.model.isInDebugMode.addOnChangeListener(this.updateDebugMenuHandler);

	}

	deactivateInternal() {
		this.model.assets.isLoading.removeOnChangeListener(this.updateLoadingHandler);
		this.model.isInDebugMode.removeOnChangeListener(this.updateDebugMenuHandler);
		this.removeElement(this.mainLayer);
	}

	updateLoading() {
		if (this.loading) {
			this.removeElement(this.loading);
			this.loading = null;
		}
		if (this.model.assets.isLoading.get()) {
			this.loading = this.addElement('div', 'loading');
			const inner = Pixies.createElement(this.loading, 'div');
			inner.innerText = Pixies.randomElement(['Obětuji ovci...', 'Rozdělávám oheň...', 'Zpívám bohům...', 'Zahajuji rituál...']);
		}
	}

	updateDebugMenu() {
		if (this.editorRenderer) {
			this.removeChild(this.editorRenderer);
			this.editorRenderer = null;
		}
		if (this.model.isInDebugMode.get()) {
			this.editorRenderer = new EditorRenderer(this.game, this.model.editor, this.dom);
			this.addChild(this.editorRenderer);
		}
	}

}
