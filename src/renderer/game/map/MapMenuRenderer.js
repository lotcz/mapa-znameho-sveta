import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import {TIME_TYPE_NAMES} from "../../../model/game/TimeModel";

export default class MapMenuRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'map-menu paper');
		this.inner = Pixies.createElement(this.container,'div', 'inner p-3');
		this.art = Pixies.createElement(this.inner,'div', 'art');
		this.artLower = Pixies.createElement(this.art, 'div', 'lower');
		this.artUpper = Pixies.createElement(this.art,'div', 'upper');
		this.artLowerImg = null;
		this.artUpperImg = null;

		this.time = Pixies.createElement(this.inner,'div', 'time');
		this.timeType = Pixies.createElement(this.inner,'div', 'time-type');

		this.buttons = Pixies.createElement(this.inner, 'div', 'buttons column center');
		const start = Pixies.createElement(this.buttons, 'button', null, 'Start/Stop', () => {
			this.model.partyTraveling.invert();
		});
		const revert = Pixies.createElement(this.buttons, 'button', null, 'Revert', () => {
			this.model.forward.invert();
		});
		const sleep = Pixies.createElement(this.buttons, 'button', null, 'Sleep', () => {
			this.model.partyResting.set(0.4);
		});
		const battle = Pixies.createElement(this.buttons, 'button', 'special', 'To Battle', () => {
			this.model.triggerEvent('to-battle');
		});

		this.updateArt();
		this.updateTime();
		this.updateTimeType();

		this.model.triggerEvent('trigger-resize');
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.model.triggerEvent('trigger-resize');
	}

	renderInternal() {
		if (this.model.currentBiotope.isDirty || this.model.time.timeOfDay.isDirty) {
			this.updateArt();
		}
		if (this.model.time.timeOfDay.isDirty) {
			this.updateTime();
		}
		if (this.model.time.timeType.isDirty) {
			this.updateTimeType();
		}
	}

	clearArt() {
		this.artLowerImg = null;
		this.artUpperImg = null;
		Pixies.emptyElement(this.artLower);
		Pixies.emptyElement(this.artUpper);
	}

	updateTime() {
		this.time.innerText = Pixies.round(this.model.time.timeOfDay.get(), 2);
	}

	updateTimeType() {
		this.timeType.innerText = TIME_TYPE_NAMES[this.model.time.timeType.get()];
	}

	updateArt() {

		/** @type BiotopeModel */
		let biotope = this.model.currentBiotope.get();

		if (biotope === null || biotope === undefined || biotope.images.count() <= 0) {
			this.clearArt();
			return;
		}

		const time = this.model.time.timeOfDay.get();
		let lower = biotope.images.first();
		let upper = null;

		if (biotope.images.count() > 1) {
			let i = 0;
			while (i < biotope.images.count() && biotope.images.get(i).time.get() <= time) {
				i++;
			}
			i = i < biotope.images.count() ? i : 0;
			upper = biotope.images.get(i);
			lower = biotope.images.get(i === 0 ? biotope.images.count() - 1 : i - 1);
			if (upper.uri.equalsTo(lower.uri.get())) {
				upper = null;
			}
		}

		this.game.assets.getAsset(lower.uri.get(), (img) => {
			if (!this.artLowerImg) {
				this.artLowerImg = Pixies.createElement(this.artLower, 'img');
			}
			this.artLowerImg.src = img.src;
		});

		if (upper) {
			this.game.assets.getAsset(upper.uri.get(), (img) => {
				if (!this.artUpperImg) {
					this.artUpperImg = Pixies.createElement(this.artUpper,'img');
				}
				this.artUpperImg.src = img.src;
				const min = lower.time.get();
				const max = upper.time.get();
				const realMax = min > max ? 1 : max;
				const progress = (time - min) / (realMax - min);
				this.artUpperImg.style.opacity = Pixies.round(progress, 2);
			});
		} else {
			if (this.artUpperImg) {
				this.artUpperImg = null;
				Pixies.emptyElement(this.artUpper);
			}
		}
	}

}
