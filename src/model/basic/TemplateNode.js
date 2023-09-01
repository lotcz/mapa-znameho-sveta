import IdentifiedModelNode from "./IdentifiedModelNode";
import IntValue from "./IntValue";

export default class TemplateNode extends IdentifiedModelNode {

	/**
	 * @type IntValue
	 */
	originalId;

	constructor(id = 0) {
		super(id);

		this.originalId = this.addProperty('originalId', new IntValue());
	}

	isCloned() {
		return this.originalId.isSet();
	}

	getOriginalId() {
		if (this.originalId.isSet()) return this.originalId.get();
		return this.id.get();
	}

	isOriginalId(id) {
		return this.getOriginalId() === id;
	}

	isFromSameOrigin(tn) {
		if (typeof tn.getOriginalId !== 'function') return false;
		return this.isOriginalId(tn.getOriginalId());
	}

	/**
	 * @return TemplateNode
	 */
	clone() {
		throw new Error('Clone function not defined!');
		//const ch = new CharacterModel();
		//ch.restoreState(this.getState());
		//ch.originalId.set(this.id.get());
		//return ch;
	}
}
