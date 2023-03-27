import ModelNode from "../../basic/ModelNode";
import FloatValue from "../../basic/FloatValue";
import StringValue from "../../basic/StringValue";

export const TEMPERATURE_FREEZING = 0;
export const TEMPERATURE_COLD = 2;
export const TEMPERATURE_CHILLING = 4;
export const TEMPERATURE_OK = 6;
export const TEMPERATURE_WARM = 8;
export const TEMPERATURE_HOT = 10;
export const TEMPERATURE_HEAT = 999;

export const TEMPERATURE_TYPE_FREEZING = 'freezing';
export const TEMPERATURE_TYPE_COLD = 'cold';
export const TEMPERATURE_TYPE_CHILLING = 'chilling';
export const TEMPERATURE_TYPE_OK = 'ok';
export const TEMPERATURE_TYPE_WARM = 'warm';
export const TEMPERATURE_TYPE_HOT = 'hot';
export const TEMPERATURE_TYPE_HEAT = 'heat';

const TEMPERATURE_TYPES = [TEMPERATURE_TYPE_FREEZING, TEMPERATURE_TYPE_COLD, TEMPERATURE_TYPE_CHILLING, TEMPERATURE_TYPE_OK, TEMPERATURE_TYPE_WARM, TEMPERATURE_TYPE_HOT, TEMPERATURE_TYPE_HEAT];

const TEMPERATURE_TABLE = [];

TEMPERATURE_TABLE[TEMPERATURE_TYPE_FREEZING] = TEMPERATURE_FREEZING;
TEMPERATURE_TABLE[TEMPERATURE_TYPE_COLD] = TEMPERATURE_COLD;
TEMPERATURE_TABLE[TEMPERATURE_TYPE_CHILLING] = TEMPERATURE_CHILLING;
TEMPERATURE_TABLE[TEMPERATURE_TYPE_OK] = TEMPERATURE_OK;
TEMPERATURE_TABLE[TEMPERATURE_TYPE_WARM] = TEMPERATURE_WARM;
TEMPERATURE_TABLE[TEMPERATURE_TYPE_HOT] = TEMPERATURE_HOT;
TEMPERATURE_TABLE[TEMPERATURE_TYPE_HEAT] = TEMPERATURE_HEAT;

export const TEMPERATURE_TYPE_NAMES = [];

TEMPERATURE_TYPE_NAMES[TEMPERATURE_TYPE_FREEZING] = 'holomráz';
TEMPERATURE_TYPE_NAMES[TEMPERATURE_TYPE_COLD] = 'mráz';
TEMPERATURE_TYPE_NAMES[TEMPERATURE_TYPE_CHILLING] = 'chladno';
TEMPERATURE_TYPE_NAMES[TEMPERATURE_TYPE_OK] = 'příjemně';
TEMPERATURE_TYPE_NAMES[TEMPERATURE_TYPE_WARM] = 'teplo';
TEMPERATURE_TYPE_NAMES[TEMPERATURE_TYPE_HOT] = 'vedro';
TEMPERATURE_TYPE_NAMES[TEMPERATURE_TYPE_HEAT] = 'výheň';

export default class TemperatureModel extends ModelNode {

	/**
	 * @type FloatValue
	 */
	value;

	/**
	 * @type StringValue
	 */
	temperatureType;

	constructor(persistent = false) {
		super(persistent);

		this.value = this.addProperty('value', new FloatValue(TEMPERATURE_OK, persistent));
		this.temperatureType = this.addProperty('temperatureType', new StringValue(TEMPERATURE_TYPE_OK, false));

		this.value.addOnChangeListener(() => this.updateTemperatureType());
		this.updateTemperatureType();
	}

	updateTemperatureType() {
		const temperature = this.value.get();
		for (let i = 0, max = TEMPERATURE_TYPES.length; i < max; i++) {
			const t = TEMPERATURE_TYPES[i];
			if (temperature <= TEMPERATURE_TABLE[t]) {
				this.temperatureType.set(t);
				return;
			}
		}

	}
}
