import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import MapRenderer from "../MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import BattleRenderer from "../BattleRenderer";
import NodeTableRenderer from "./NodeTableRenderer";

export default class EditorRenderer extends DomRenderer {

	/**
	 * @type EditorModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;
		this.menu = null;

		this.updateModeHandler = () => this.updateMode();
		this.updateMenuHandler = () => this.updateMenu();
		this.closeTableHandler = () => this.closeTable();
	}

	activateInternal() {
		this.container = this.addElement('div', ['editor', 'container-host']);
		this.container.addEventListener('mousemove', (e) => e.stopPropagation());
		this.container.addEventListener('click', (e) => e.stopPropagation());

		this.nav = Pixies.createElement(this.container, 'nav');
		this.dock = Pixies.createElement(this.container, 'div', 'dock');

		this.tableRenderer = null;

		this.updateMenu();
		this.model.activeOption.addOnChangeListener(this.updateMenuHandler);

		this.updateMode();
		this.game.saveGame.mode.addOnChangeListener(this.updateModeHandler);

	}

	deactivateInternal() {
		this.model.activeOption.removeOnChangeListener(this.updateMenuHandler);
		this.game.saveGame.mode.removeOnChangeListener(this.updateModeHandler);
		this.removeElement(this.container);
	}

	updateMode() {
		if (this.debugMenu) {
			Pixies.destroyElement(this.debugMenu);
			this.debugMenu = null;
		}
		this.debugMenu = Pixies.createElement(this.nav, 'div', 'debug-menu');
		const mapButton = Pixies.createElement(this.debugMenu, 'button', this.game.saveGame.mode.equalsTo(GAME_MODE_MAP) ? 'active' : null);
		mapButton.innerText = 'MAP';
		mapButton.addEventListener('click', () => this.game.saveGame.mode.set(GAME_MODE_MAP));
		const battleButton = Pixies.createElement(this.debugMenu, 'button', this.game.saveGame.mode.equalsTo(GAME_MODE_BATTLE) ? 'active' : null);
		battleButton.innerText = 'BATTLE';
		battleButton.addEventListener('click', () => this.game.saveGame.mode.set(GAME_MODE_BATTLE));
	}

	updateMenu() {
		if (this.menu) {
			Pixies.destroyElement(this.menu);
		}
		this.menu = Pixies.createElement(this.dock, 'ul', 'menu');
		Object.keys(this.model.menuOptions).forEach((key) => {
			const isActive = this.model.activeOption.equalsTo(key);
			const item = Pixies.createElement(this.menu,'li', isActive ? 'active' : null);
			const link = Pixies.createElement(item,'a');
			link.innerText = this.model.menuOptions[key];
			link.addEventListener('click', () => this.model.activeOption.set(key));
		});
		this.updateTable();
	}

	updateTable() {
		this.closeTable();

		const name = this.model.activeOption.get();
		if (name && name.length > 0) {
			const table = this.game.resources[name];
			table.addEventListener('closed', this.closeTableHandler);
			this.tableRenderer = this.addChild(new NodeTableRenderer(this.game, table, this.dock, name));
		}
	}

	closeTable() {
		if (this.tableRenderer) {
			this.tableRenderer.model.removeEventListener('closed', this.closeTableHandler);
			this.removeChild(this.tableRenderer);
			this.tableRenderer = null;
		}
	}

}
