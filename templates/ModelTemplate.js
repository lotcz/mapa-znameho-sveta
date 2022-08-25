import ModelNode from "../basic/ModelNode";

export default class $NAME$ extends ModelNode {

	/**
	 * @type $TP$
	 */
	mode;

	constructor() {
		super();

		this.mode = this.addProperty('mode', new $TP$($VAL$));
		
	}

}
