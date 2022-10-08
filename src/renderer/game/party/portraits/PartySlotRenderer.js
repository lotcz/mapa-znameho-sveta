import DomRenderer from "../../../basic/DomRenderer";
import NullableNodeRenderer from "../../../basic/NullableNodeRenderer";
import PartyCharacterRenderer from "./PartyCharacterRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class PartySlotRenderer extends DomRenderer {

	/**
	 * @type PartySlotModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;

		this.characterRenderer = new NullableNodeRenderer(this.game, this.model.character, (m) => new PartyCharacterRenderer(this.game, m, this.container));
		this.addChild(this.characterRenderer);

		this.addAutoEvent(
			this.game.saveGame.get().party.selectedCharacterId,
			'change',
			() => this.updateSelection(),
			true
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'slot');
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.characterId.isDirty) {
			this.updateSelection();
		}
	}

	updateSelection() {
		const selected = this.game.saveGame.get().party.selectedCharacterId.equalsTo(this.model.characterId.get());
		if (selected) {
			Pixies.addClass(this.container, 'selected');
		} else {
			Pixies.removeClass(this.container, 'selected');
		}
	}
}
