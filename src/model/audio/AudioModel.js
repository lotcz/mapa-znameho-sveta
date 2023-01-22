import ModelNode from "../basic/ModelNode";
import StringValue from "../basic/StringValue";
import FloatValue from "../basic/FloatValue";
import BoolValue from "../basic/BoolValue";

export default class AudioModel extends ModelNode {

	/**
	 * @type StringValue
	 */
	url;

	/**
	 * @type FloatValue
	 */
	volume;

	/**
	 * @type BoolValue
	 */
	playing;

	/**
	 * @type BoolValue
	 */
	loop;

	constructor(persistent = true) {
		super(persistent);

		this.url = this.addProperty('url', new StringValue());
		this.volume = this.addProperty('volume', new FloatValue(1));
		this.playing = this.addProperty('audioOn', new BoolValue(true));
		this.loop = this.addProperty('loop', new BoolValue(false));
	}
}
