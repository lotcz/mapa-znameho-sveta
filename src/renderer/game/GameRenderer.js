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
				(m) => new MenuRenderer(this.game, m, this.menuLayer)
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

		this.addAutoEvent(
			this.model.assets,
			'blocking-loaders-changed',
			() => this.updateLoading(),
			true
		);

		this.addAutoEvent(
			this.model.isInDebugMode,
			'change',
			() => this.updateDebugMenu(),
			true
		);

	}

	activateInternal() {
		const initLoading = document.getElementById('initial_loading');
		if (initLoading) Pixies.destroyElement(initLoading);

		this.saveGameLayer = this.addElement('div', 'savegame-layer container container-host row');
		this.menuLayer = this.addElement('div', 'menu-layer');
		this.editorLayer = this.addElement('div', 'editor-layer');

		this.model.assets.preload(this.model.getResourcesForPreload());
	}

	deactivateInternal() {
		this.removeElement(this.saveGameLayer);
		this.removeElement(this.editorLayer);
	}

	updateLoading() {
		const isLoading = this.model.assets.blockingLoaders > 0;
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
			if (this.game.assets.blockingLoaders > this.loadersCount) {
				this.loadersCount = this.game.assets.blockingLoaders;
			}
			const remaining = this.game.assets.blockingLoaders;
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
