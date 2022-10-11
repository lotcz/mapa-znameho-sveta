import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

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

		this.buttons = Pixies.createElement(this.inner, 'div', 'buttons column center');
		const start = Pixies.createElement(this.buttons, 'button', null, 'Start/Stop', () => {
			this.game.saveGame.get().partyTraveling.set(!this.game.saveGame.get().partyTraveling.get());
		});
		const revert = Pixies.createElement(this.buttons, 'button', null, 'Revert', () => {
			this.game.saveGame.get().forward.set(!this.game.saveGame.get().forward.get());
		});
		const sleep = Pixies.createElement(this.buttons, 'button', null, 'Sleep', () => {
			this.game.saveGame.get().partyResting.set(0.4);
		});
		const battle = Pixies.createElement(this.buttons, 'button', 'special', 'To Battle', () => {
			this.model.triggerEvent('to-battle');
		});

		this.updateArt();

		this.model.triggerEvent('right-panel-resize');
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.currentPath.isDirty || this.model.currentLocation.isDirty || this.model.time.isDirty) {
			this.time.innerText = Pixies.round(this.model.time.get(), 2);
			this.updateArt();
		}
	}

	clearArt() {
		this.artLowerImg = null;
		this.artUpperImg = null;
		Pixies.emptyElement(this.artLower);
		Pixies.emptyElement(this.artUpper);
	}

	updateArt() {

		/** @type BiotopeModel */
		let biotope = null;

		if (this.model.currentLocation.isSet()) {
			biotope = this.model.currentLocation.get().biotope.get();
		} else if (this.model.currentPath.isSet()) {
			biotope = this.model.currentPath.get().biotope.get();
		}

		if (biotope === null || biotope.images.count() <= 0) {
			this.clearArt();
			return;
		}

		const time = this.model.time.get();
		let lower = biotope.images.first();
		let upper = null;

		//console.log(biotope.images);

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
