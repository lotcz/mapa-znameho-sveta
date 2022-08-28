import SvgRenderer from "../../basic/SvgRenderer";

export default class MapPartyRenderer extends SvgRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;

	}

	activateInternal() {

		this.group = this.draw.group();

		this.marker = null;

		const token = 'marker-location';
		if (!this.refExists(token)) {
			this.game.assets.getAsset(
				'img/icon/marker-stop.svg',
				(img) => {
					const marker = this.getDefs().image(img.src);
					this.setRef(token, marker);
					this.renderParty();
				}
			);
		} else {
			this.renderParty();
		}

		const tokenFire = 'marker-traveling';
		if (!this.refExists(tokenFire)) {
			this.game.assets.getAsset(
				'img/icon/marker-traveling.svg',
				(img) => {
					const campfire = this.getDefs().image(img.src);
					this.setRef(tokenFire, campfire);
					this.renderParty();
				}
			);
		} else {
			this.renderParty();
		}

	}

	deactivateInternal() {
		this.group.remove();
	}

	renderInternal() {
		if (this.model.partyCoordinates.isDirty || this.model.currentPath.isDirty) {
			this.renderParty();
		}
		if (this.model.partyTraveling.isDirty) {
			this.renderParty();
		}
	}

	renderParty() {
		if (!this.marker) {
			if (!this.refExists('marker-traveling')) {
				return;
			}
			this.marker = this.group.group();
			const img = this.marker.use(this.getRef('marker-traveling'));
			img.scale(5);
		}

		if (!this.campfire) {
			if (!this.refExists('marker-location')) {
				return;
			}
			this.campfire = this.group.group();
			const img = this.campfire.use(this.getRef('marker-location'));
			img.scale(5);
		}

		if (this.model.partyTraveling.get()) {
			this.marker.show();
			this.campfire.hide();
		} else {
			this.marker.hide();
			this.campfire.show();
		}

		const pos = this.model.partyCoordinates;
		this.group.center(pos.x, pos.y);
	}

}
