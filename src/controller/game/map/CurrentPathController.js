import ControllerNode from "../../basic/ControllerNode";

const TRAVEL_SPEED = 40; // px per second
const TIME_SPEED = 0.05; // portion of day per second

export default class CurrentPathController extends ControllerNode {

	/**
	 * @type PathModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.biotopeId,
			'change',
			() => {
				this.model.biotope.set(this.game.resources.map.biotopes.getById(this.model.biotopeId.get()));
			},
			true
		);

		this.addAutoEvent(this.model, 'path-marker-position', (pos) => {
			const save = this.game.saveGame.get();
			this.runOnUpdate(() => save.partyCoordinates.set(pos));
			if (this.game.saveGame.get().partyTraveling.get()) {
				this.runOnUpdate(() => save.mapCenterCoordinates.set(pos));
			}
		});

		this.addAutoEvent(this.game.saveGame.get(), 'go-back', () => {
			this.runOnUpdate(() => {
				const save = this.game.saveGame.get();
				save.forward.set(!save.forward.get());
				save.partyTraveling.set(true);
			});
		});

		this.addAutoEvent(this.game.saveGame.get(), 'go-forward', () => {
			this.runOnUpdate(() => {
				const save = this.game.saveGame.get();
				save.partyTraveling.set(true);
			});
		});

		this.addAutoEvent(this.game.controls, 'right-click', () => {
			this.runOnUpdate(() => {
				const save = this.game.saveGame.get();
				save.partyTraveling.set(false);
			});
		});

	}

	activateInternal() {
		//this.ui.editor.activeForm.set(this.model);
		this.game.saveGame.get().currentLocationId.set(0);
	}

	updateInternal(delta) {

		if (!this.game.saveGame.get().partyTraveling.get()) {
			return;
		}

		// travel

		const save = this.game.saveGame.get();

		let progress = this.model.pathProgress.get() + ((delta / 1000) * TRAVEL_SPEED * (save.forward.get() ? 1 : -1));

		if (progress > this.model.length.get()) {
			save.currentLocationId.set(this.model.endLocationId.get());
		}

		if (progress < 0) {
			save.currentLocationId.set(this.model.startLocationId.get());
		}

		this.model.pathProgress.set(progress);
		save.pathProgress.set(progress);

		const diff = (delta / 1000) * TIME_SPEED;
		save.passTime(diff);
	}

}
