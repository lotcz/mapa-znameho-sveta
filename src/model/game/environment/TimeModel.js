import ModelNode from "../../basic/ModelNode";
import FloatValue from "../../basic/FloatValue";
import StringValue from "../../basic/StringValue";

export const TIME_HOUR = 1/24;
export const TIME_MINUTE = TIME_HOUR/60;

export const TIME_MIDNIGHT = 0;
export const TIME_MORNING = 6 * TIME_HOUR;
export const TIME_NOON = 10 * TIME_HOUR;
export const TIME_AFTERNOON = 14 * TIME_HOUR;
export const TIME_EVENING = 18 * TIME_HOUR;
export const TIME_NIGHT = 22 * TIME_HOUR;

export const TIME_TYPE_MIDNIGHT = 'midnight';
export const TIME_TYPE_MORNING = 'morning';
export const TIME_TYPE_NOON = 'noon';
export const TIME_TYPE_AFTERNOON = 'afternoon';
export const TIME_TYPE_EVENING = 'evening';
export const TIME_TYPE_NIGHT = 'night';

const TIME_TYPES = [TIME_TYPE_MIDNIGHT, TIME_TYPE_MORNING, TIME_TYPE_NOON, TIME_TYPE_AFTERNOON, TIME_TYPE_EVENING, TIME_TYPE_NIGHT];

const TIME_TABLE = [];

TIME_TABLE[TIME_TYPE_MIDNIGHT] = TIME_MIDNIGHT;
TIME_TABLE[TIME_TYPE_MORNING] = TIME_MORNING;
TIME_TABLE[TIME_TYPE_NOON] = TIME_NOON;
TIME_TABLE[TIME_TYPE_AFTERNOON] = TIME_AFTERNOON;
TIME_TABLE[TIME_TYPE_EVENING] = TIME_EVENING;
TIME_TABLE[TIME_TYPE_NIGHT] = TIME_NIGHT;

export const TIME_TYPE_NAMES = [];

TIME_TYPE_NAMES[TIME_TYPE_MIDNIGHT] = 'noc';
TIME_TYPE_NAMES[TIME_TYPE_MORNING] = 'ráno';
TIME_TYPE_NAMES[TIME_TYPE_NOON] = 'poledne';
TIME_TYPE_NAMES[TIME_TYPE_AFTERNOON] = 'odpoledne';
TIME_TYPE_NAMES[TIME_TYPE_EVENING] = 'večer';
TIME_TYPE_NAMES[TIME_TYPE_NIGHT] = 'noc';

export default class TimeModel extends ModelNode {

	/**
	 * @type FloatValue
	 */
	timeOfDay;

	/**
	 * @type StringValue
	 */
	timeType;

	constructor() {
		super();

		this.timeOfDay = this.addProperty('timeOfDay', new FloatValue(TIME_MIDNIGHT));
		this.timeType = this.addProperty('timeType', new StringValue(TIME_TYPE_MIDNIGHT, false));

		this.timeOfDay.addOnChangeListener(() => this.updateTimeType());
		this.updateTimeType();
	}

	passTime(duration) {
		let time = this.timeOfDay.get() + duration;
		if (time > 1) {
			time = time - 1;
		}
		this.timeOfDay.set(time);
		this.triggerEvent('time-passed', duration);
	}

	updateTimeType() {
		const time = this.timeOfDay.get();
		let result = TIME_TYPES[0];
		for (let i = 1, max = TIME_TYPES.length; i < max; i++) {
			const t = TIME_TYPES[i];
			if (time < TIME_TABLE[t]) {
				break;
			}
			result = t;
		}
		this.timeType.set(result);
	}

}
