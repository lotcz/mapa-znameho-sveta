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
			if (!this.model.isCurrentPath.get()) {
				return;
			}
			if (!this.game.saveGame.get().partyTraveling.get()) {
				return;
			}

			this.runOnUpdate(() => {
				const save = this.game.saveGame.get();
				save.partyCoordinates.set(pos);
				const center = this.game.viewBoxSize.multiply(0.5 * save.zoom.get());
				const corner = pos.subtract(center);
				save.coordinates.set(corner)
			});
		});
	}


	updateInternal(delta) {

		if (!this.game.saveGame.get().partyTraveling.get()) {
			return;
		}

		// travel

		let progress = this.model.pathProgress.get() + ((delta / 1000) * TRAVEL_SPEED * (this.game.saveGame.get().forward.get() ? 1 : -1));

		if (progress > this.model.length.get()) {
			progress = this.model.length.get();
			this.game.saveGame.get().forward.set(!this.game.saveGame.get().forward.get());
		}

		if (progress < 0) {
			progress = 0;
			this.game.saveGame.get().forward.set(!this.game.saveGame.get().forward.get());
		}

		this.model.pathProgress.set(progress);
		this.game.saveGame.get().pathProgress.set(progress);


	}

}
