import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import EditorRenderer from "../editor/EditorRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import SaveGameRenderer from "./SaveGameRenderer";
import GlobalAudioRenderer from "../audio/GlobalAudioRenderer";
import MenuRenderer from "../menu/MenuRenderer";

export default class GameRenderer extends DomRenderer {

	/**
	 * @type GameModel
	 */
	model;

	constructor(model, dom) {
		super(model, model, dom);

		this.model = model;
		this.loading = null;
		this.addClass('container-host');
		this.editorRenderer = null;

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.menu,
				(m) => new MenuRenderer(this.game, m, this.dom)
			)
		);

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.saveGame,
				(m) => new SaveGameRenderer(this.game, m, this.saveGameLayer)
			)
		);

		this.addChild(
			new GlobalAudioRenderer(
				this.model,
				this.model.audio
			)
		);

		this.updateLoadingHandler = () => this.updateLoading();
		this.updateDebugMenuHandler = () => this.updateDebugMenu();
	}

	activateInternal() {
		const initLoading = document.getElementById('initial_loading');
		if (initLoading) Pixies.destroyElement(initLoading);

		this.saveGameLayer = this.addElement('div', 'savegame-layer container container-host row');
		this.editorLayer = this.addElement('div', 'editor-layer');

		this.updateLoading();
		this.model.assets.isLoading.addOnChangeListener(this.updateLoadingHandler);
		this.model.assets.loaders.addEventListener('change', this.updateLoadingHandler);

		this.updateDebugMenu();
		this.model.isInDebugMode.addOnChangeListener(this.updateDebugMenuHandler);

	}

	deactivateInternal() {
		this.model.assets.isLoading.removeOnChangeListener(this.updateLoadingHandler);
		this.model.assets.loaders.removeEventListener('change', this.updateLoadingHandler);
		this.model.isInDebugMode.removeOnChangeListener(this.updateDebugMenuHandler);
		this.removeElement(this.saveGameLayer);
		this.removeElement(this.editorLayer);
	}

	updateLoading() {
		const isLoading = this.model.assets.isLoading.get();
		if (this.loading && !isLoading) {
			this.removeElement(this.loading);
			this.loading = null;
		}
		if (isLoading) {
			if (!this.loading) {
				this.loadersCount = 1;
				this.loading = this.addElement('div', 'loading container');
				const paper = Pixies.createElement(this.loading, 'div', 'paper');
				const inner = Pixies.createElement(paper, 'div', 'inner p-3');
				const content = Pixies.createElement(inner, 'div', 'm-3 p-3');
				const label1 = Pixies.createElement(content, 'h2', null, 'Nahrávám');
				const progressWrapper = Pixies.createElement(content, 'div', 'progress-wrapper mt-2');
				this.loadingProgress = Pixies.createElement(progressWrapper, 'div', 'stretch');
			}
			if (this.game.assets.loaders.count() > this.loadersCount) {
				this.loadersCount = this.game.assets.loaders.count();
			}
			const remaining = this.game.assets.loaders.count();
			const portion = 1 - (remaining / this.loadersCount);
			this.loadingProgress.style.width = `${Math.round(portion*100)}%`;
		}
	}

	updateDebugMenu() {
		if (this.editorRenderer) {
			this.removeChild(this.editorRenderer);
			this.editorRenderer = null;
		}
		if (this.model.isInDebugMode.get()) {
			this.editorRenderer = new EditorRenderer(this.game, this.model.editor, this.editorLayer);
			this.addChild(this.editorRenderer);
		}
	}

}
