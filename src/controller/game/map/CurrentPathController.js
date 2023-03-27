import {TIME_HOUR} from "../../../model/game/environment/TimeModel";
import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";

const TRAVEL_SPEED = 40; // px per second
const TIME_SPEED = TIME_HOUR; // portion of day per second

export default class CurrentPathController extends ControllerWithSaveGame {

	/**
	 * @type PathModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(this.model, 'path-marker-position', (pos) => {
			this.runOnUpdate(() => this.saveGame.partyCoordinates.set(pos));
			if (this.saveGame.partyTraveling.get()) {
				this.runOnUpdate(() => this.saveGame.mapCenterCoordinates.set(pos));
			}
		});

		this.addAutoEvent(this.game.saveGame.get(), 'go-back', () => {
			this.runOnUpdate(() => {
				this.saveGame.forward.set(!this.saveGame.forward.get());
				this.saveGame.partyTraveling.set(true);
			});
		});

		this.addAutoEvent(this.game.saveGame.get(), 'go-forward', () => {
			this.runOnUpdate(() => {
				this.saveGame.partyTraveling.set(true);
			});
		});

		this.addAutoEvent(this.game.controls, 'right-click', () => {
			this.runOnUpdate(() => {
				this.saveGame.partyTraveling.set(false);
			});
		});

	}

	activateInternal() {
		this.saveGame.currentLocationId.set(null);
	}

	updateInternal(delta) {

		if (!this.saveGame.partyTraveling.get()) {
			return;
		}

		// travel

		let progress = this.model.pathProgress.get() + ((delta / 1000) * TRAVEL_SPEED * (this.saveGame.forward.get() ? 1 : -1));

		if (progress > this.model.length.get()) {
			this.saveGame.currentLocationId.set(this.model.endLocationId.get());
		}

		if (progress < 0) {
			this.saveGame.currentLocationId.set(this.model.startLocationId.get());
		}

		this.model.pathProgress.set(progress);
		this.saveGame.pathProgress.set(progress);

		const duration = (delta / 1000) * TIME_SPEED;
		this.saveGame.time.passTime(duration);
	}

}
