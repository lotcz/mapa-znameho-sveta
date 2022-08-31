import ControllerNode from "../../basic/ControllerNode";

const TRAVEL_SPEED = 40; // px per second

export default class CurrentPathController extends ControllerNode {

	/**
	 * @type PathModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(this.model, 'path-marker-position', (pos) => {
			this.runOnUpdate(() => {
				const save = this.game.saveGame.get();
				save.partyCoordinates.set(pos);
			});
			if (this.game.saveGame.get().partyTraveling.get()) {
				this.runOnUpdate(() => {
					const save = this.game.saveGame.get();
					const center = this.game.viewBoxSize.multiply(0.5 * save.zoom.get());
					const corner = pos.subtract(center);
					save.coordinates.set(corner)
				});
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
		this.game.editor.activeForm.set(this.model);
		this.game.saveGame.get().currentLocationId.set(0);
	}

	updateInternal(delta) {

		if (!this.game.saveGame.get().partyTraveling.get()) {
			return;
		}

		// travel

		let progress = this.model.pathProgress.get() + ((delta / 1000) * TRAVEL_SPEED * (this.game.saveGame.get().forward.get() ? 1 : -1));

		if (progress > this.model.length.get()) {
			this.game.saveGame.get().currentLocationId.set(this.model.endLocationId.get());
		}

		if (progress < 0) {
			this.game.saveGame.get().currentLocationId.set(this.model.startLocationId.get());
		}

		this.model.pathProgress.set(progress);
		this.game.saveGame.get().pathProgress.set(progress);


	}

}
