import Pixies from "../../../class/basic/Pixies";
import DomRenderer from "../../basic/DomRenderer";
import {SPECIAL_TYPES} from "../../../model/game/battle/battlemap/BattleSpecialModel";

export default class BattleEditorSpecialsRenderer extends DomRenderer {

	/**
	 * @type BattleEditorModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'column');
		this.top = Pixies.createElement(this.container, 'div');
		this.updateSpecialType();
	}

	deactivateInternal() {
		Pixies.destroyElement(this.container);
	}

	renderInternal() {
		if (this.model.specialType.isDirty) {
			this.updateSpecialType();
		}
	}

	updateSpecialType() {
		Pixies.emptyElement(this.top);
		SPECIAL_TYPES.forEach((specialType) => {
			const r = Pixies.createElement(this.top, 'input');
			r.setAttribute('type', 'radio');
			r.setAttribute('name', 'specialType');
			r.setAttribute('id',  `st-${specialType}`);
			r.setAttribute('value', specialType);
			r.checked = this.model.specialType.equalsTo(specialType);
			r.addEventListener('change',  () => {
				this.model.specialType.set(specialType);
			});
			const l = Pixies.createElement(this.top, 'label');
			l.setAttribute('for', `st-${specialType}`);
			l.innerText = specialType;
		});
	}
}
