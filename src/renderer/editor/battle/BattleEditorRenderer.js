import Pixies from "../../../class/basic/Pixies";
import DomRenderer from "../../basic/DomRenderer";
import ConditionalNodeRenderer from "../../basic/ConditionalNodeRenderer";
import {MODE_ACTIONS, MODE_TYPE_SPECIAL, MODE_TYPE_SPRITE, MODE_TYPES} from "../../../model/editor/BattleEditorModel";
import BattleEditorSpritesRenderer from "./BattleEditorSpritesRenderer";
import BattleEditorSpecialsRenderer from "./BattleEditorSpecialsRenderer";

export default class BattleEditorRenderer extends DomRenderer {

	/**
	 * @type BattleEditorModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.dom = dom;
		this.container = null;

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.modeType,
				() => this.model.modeType.equalsTo(MODE_TYPE_SPRITE),
				() => new BattleEditorSpritesRenderer(this.game, this.model, this.bottom)
			)
		);

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.modeType,
				() => this.model.modeType.equalsTo(MODE_TYPE_SPECIAL),
				() => new BattleEditorSpecialsRenderer(this.game, this.model, this.bottom)
			)
		);

		this.addAutoEvent(
			this.model.modeAction,
			'change',
			() => this.updateModeAction(),
			true
		);

		this.addAutoEvent(
			this.model.modeType,
			'change',
			() => this.updateModeType(),
			true
		);

	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'battle-menu bg column');

		this.top = Pixies.createElement(this.container, 'div');
		this.brushSize = Pixies.createElement(this.top, 'div');
		this.modeAction = Pixies.createElement(this.top, 'div');
		this.modeType = Pixies.createElement(this.top, 'div');
		this.bottom = Pixies.createElement(this.container, 'div');

		for (let i = 0; i <= 5; i++) {
			const r = Pixies.createElement(this.brushSize, 'input');
			r.setAttribute('type', 'radio');
			r.setAttribute('name', 'brushSize');
			r.setAttribute('id',  `bs-${i}`);
			r.setAttribute('value', String(i));
			r.checked = this.model.brushSize.equalsTo(i);
			r.addEventListener('change',  () => {
				this.model.brushSize.set(i);
			});
			const l = Pixies.createElement(this.brushSize, 'label');
			l.setAttribute('for', `bs-${i}`);
			l.innerText = String(i);
		}

	}

	deactivateInternal() {
		Pixies.destroyElement(this.container);
	}

	updateModeAction() {
		Pixies.emptyElement(this.modeAction);
		MODE_ACTIONS.forEach((mode) => {
			const r = Pixies.createElement(this.modeAction, 'input');
			r.setAttribute('type', 'radio');
			r.setAttribute('name', 'modeAction');
			r.setAttribute('id',  `ma-${mode}`);
			r.setAttribute('value', mode);
			r.checked = this.model.modeAction.equalsTo(mode);
			r.addEventListener('change',  () => {
				this.model.modeAction.set(mode);
			});
			const l = Pixies.createElement(this.modeAction, 'label');
			l.setAttribute('for', `ma-${mode}`);
			l.innerText = mode;
		});
	}

	updateModeType() {
		Pixies.emptyElement(this.modeType);
		MODE_TYPES.forEach((mode) => {
			const r = Pixies.createElement(this.modeType, 'input');
			r.setAttribute('type', 'radio');
			r.setAttribute('name', 'modeType');
			r.setAttribute('id',  `mt-${mode}`);
			r.setAttribute('value', mode);
			r.checked = this.model.modeType.equalsTo(mode);
			r.addEventListener('change',  () => {
				this.model.modeType.set(mode);
			});
			const l = Pixies.createElement(this.modeType, 'label');
			l.setAttribute('for', `mt-${mode}`);
			l.innerText = mode;
		});
	}

}
