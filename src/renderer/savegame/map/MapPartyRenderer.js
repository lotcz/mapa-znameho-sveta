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

		this.markers = this.group.group();
		this.markers.on('mouseover', () => {
			if (!this.model.partyTraveling.get()) {
				this.markerStop2.show();
				this.markerStop.hide();
			}
		});
		this.markers.on('mouseout', () => {
			this.markerStop2.hide();
			if (!this.model.partyTraveling.get()) {
				this.markerStop.show();
			}
		});
		this.arrows = this.group.group();

		this.markerTravel = null;
		this.markerStop = null;

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

		const tokenCamp = 'marker-stop-2';
		if (!this.refExists(token)) {
			this.game.assets.getAsset(
				'img/icon/marker-stop-2.svg',
				(img) => {
					const marker = this.getDefs().image(img.src);
					this.setRef(tokenCamp, marker);
				}
			);
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

		const tokenArrow = 'party-arrow';
		if (!this.refExists(token)) {
			this.game.assets.getAsset(
				'img/icon/arrow.svg',
				(img) => {
					if (!this.refExists(token)) {
						const marker = this.getDefs().image(img.src, () => {
							this.setRef(tokenArrow, marker);
							this.renderArrows();
						});
					} else {
						this.renderArrows();
					}
				}
			);
		} else {
			this.renderArrows();
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
			this.renderArrows();
		}
	}

	renderParty() {
		if (!this.markerTravel) {
			if (!this.refExists('marker-traveling')) {
				return;
			}
			this.markerTravel = this.markers.group();
			const img = this.markerTravel.use(this.getRef('marker-traveling'));
			img.scale(5);
		}

		if (!this.markerStop) {
			if (!this.refExists('marker-location')) {
				return;
			}
			this.markerStop = this.markers.group();
			const img = this.markerStop.use(this.getRef('marker-location'));
			img.scale(5);
		}

		if (!this.markerStop2) {
			if (!this.refExists('marker-stop-2')) {
				return;
			}
			this.markerStop2 = this.markers.group();
			this.markerStop2.hide();
			const img = this.markerStop2.use(this.getRef('marker-stop-2'));
			img.scale(5);
		}

		if (this.model.partyTraveling.get()) {
			this.markerTravel.show();
			this.markerStop.hide();
		} else {
			this.markerTravel.hide();
			this.markerStop.show();
		}

		const pos = this.model.partyCoordinates;
		this.group.center(pos.x, pos.y);
	}

	renderArrows() {
		this.arrows.clear();

		if (this.model.partyTraveling.get()) {
			return;
		}

		if (this.model.currentLocation.isSet()) {
			return;
		}

		if (!this.refExists('party-arrow')) {
			return;
		}

		const diff = this.model.partyCoordinates.subtract(this.model.lastPartyCoordinates);
		diff.setSize(120);
		const rotation = this.model.lastPartyCoordinates.getRotationFromYAxis(this.model.partyCoordinates);

		const next = this.arrows.group();
		const img = next.use(this.getRef('party-arrow'));
		img.scale(6);

		const pos = this.model.partyCoordinates.add(diff);
		img.rotate( - rotation.getDegrees() + 180);
		next.center(pos.x, pos.y);

		next.opacity(0.5);
		next.on('mouseover', () => {
			next.opacity(1);
		});
		next.on('mouseout', () => {
			next.opacity(0.5);
		});
		next.on('click', () => {
			this.model.triggerEvent('go-forward');
		});

		const prev = this.arrows.group();
		const img2 = prev.use(this.getRef('party-arrow'));
		img2.scale(6);

		const pos2 = this.model.partyCoordinates.subtract(diff);
		img2.rotate( - rotation.getDegrees());
		prev.center(pos2.x, pos2.y);

		prev.opacity(0.5);
		prev.on('mouseover', () => {
			prev.opacity(1);
		});
		prev.on('mouseout', () => {
			prev.opacity(0.5);
		});
		prev.on('click', () => {
			this.model.triggerEvent('go-back');
		});
	}

}
