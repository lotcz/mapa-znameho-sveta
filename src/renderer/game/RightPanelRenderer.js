import Pixies from "../../class/basic/Pixies";
import {TIME_TYPE_NAMES} from "../../model/game/environment/TimeModel";
import DomRendererWithSaveGame from "../basic/DomRendererWithSaveGame";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import DirtyValueRenderer from "../basic/DirtyValueRenderer";
import {TEMPERATURE_TYPE_NAMES} from "../../model/game/environment/TemperatureModel";
import CharacterTooltipRenderer from "./tooltip/CharacterTooltipRenderer";
import ItemTooltipRenderer from "./tooltip/ItemTooltipRenderer";
import BattleGroundSlotsRenderer from "./battle/BattleGroundSlotsRenderer";
import BattleButtonsRenderer from "./battle/BattleButtonsRenderer";
import MapButtonsRenderer from "./map/MapButtonsRenderer";
import StatTooltipRenderer from "./tooltip/StatTooltipRenderer";
import RaceTooltipRenderer from "./tooltip/RaceTooltipRenderer";
import ConversationTooltipRenderer from "./tooltip/ConversationTooltipRenderer";
import ExitTooltipRenderer from "./tooltip/ExitTooltipRenderer";
import SimpleTooltipRenderer from "./tooltip/SimpleTooltipRenderer";

export default class RightPanelRenderer extends DomRendererWithSaveGame {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		// title
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.currentPath,
				(m) => new DirtyValueRenderer(this.game, m.name, this.title),
				() => new NullableNodeRenderer(
					this.game,
					this.model.currentLocation,
					(m) => new DirtyValueRenderer(this.game, m.name, this.title)
				)
			)
		);

		// time
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.time.timeType,
				() => new DirtyValueRenderer(this.game, this.model.time.timeType, this.timeType, (v) => TIME_TYPE_NAMES[v])
			)
		);

		// biotope name
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.currentBiotope,
				(m) => new DirtyValueRenderer(this.game, m.name, this.biotopeName)
			)
		);

		// temperature
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.temperature.temperatureType,
				() => new DirtyValueRenderer(this.game, this.model.temperature.temperatureType, this.temperature, (v) => TEMPERATURE_TYPE_NAMES[v])
			)
		);

		// buttons
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.currentBattle,
				() => new BattleButtonsRenderer(this.game, this.model, this.menuButtons),
				() => new MapButtonsRenderer(this.game, this.model, this.menuButtons)
			)
		);

		// tooltips
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.hoveringCharacter,
				(m)=> new CharacterTooltipRenderer(this.game, m, this.tooltip),
				()=> new NullableNodeRenderer(
					this.game,
					this.model.hoveringItem,
					(m)=> new ItemTooltipRenderer(this.game, m, this.tooltip),
					()=> new NullableNodeRenderer(
						this.game,
						this.model.hoveringStat,
						(m)=> new StatTooltipRenderer(this.game, m, this.tooltip),
						()=> new NullableNodeRenderer(
							this.game,
							this.model.hoveringRace,
							(m)=> new RaceTooltipRenderer(this.game, m, this.tooltip),
							()=> new NullableNodeRenderer(
								this.game,
								this.model.hoveringConversation,
								(m) => new ConversationTooltipRenderer(this.game, m, this.tooltip),
								()=> new NullableNodeRenderer(
									this.game,
									this.model.hoveringExit,
									(m)=> new ExitTooltipRenderer(this.game, m, this.tooltip),
									()=> new NullableNodeRenderer(
										this.game,
										this.model.hoveringSimple,
										(m)=> new SimpleTooltipRenderer(this.game, m, this.tooltip),
									)
								)
							)
						)
					)
				)
			)
		);

		//ground
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.currentBattle,
				(m) => new BattleGroundSlotsRenderer(this.game, m, this.ground)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'right-panel col stretch');
		this.inner = Pixies.createElement(this.container,'div', 'inner p-3 col stretch space-between');

		this.upper = Pixies.createElement(this.inner,'div', '');

		this.title = Pixies.createElement(this.upper,'h2', 'title');
		this.art = Pixies.createElement(this.upper,'div', 'art');
		this.artLower = Pixies.createElement(this.art, 'div', 'lower');
		this.artUpper = Pixies.createElement(this.art,'div', 'upper');
		this.artLowerImg = null;
		this.artUpperImg = null;

		this.info = Pixies.createElement(this.upper,'div', 'info row space-between');
		this.timeType = Pixies.createElement(this.info,'div', 'time-type');
		this.biotopeName = Pixies.createElement(this.info,'div', 'biotope-name');
		this.temperature = Pixies.createElement(this.info,'div', 'temperature');

		this.menuButtons = Pixies.createElement(this.upper,'div', 'menu-buttons');

		this.tooltip = Pixies.createElement(this.upper,'div', 'tooltip');


		this.lower = Pixies.createElement(this.inner,'div', '');
		this.ground = Pixies.createElement(this.lower, 'div', 'ground');

		this.updateArt();
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
	}

	clearArt() {
		this.artLowerImg = null;
		this.artUpperImg = null;
		Pixies.emptyElement(this.artLower);
		Pixies.emptyElement(this.artUpper);
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
