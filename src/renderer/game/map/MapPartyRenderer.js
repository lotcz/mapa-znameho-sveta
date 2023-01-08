import SvgRenderer from "../../basic/SvgRenderer";

export default class MapPartyRenderer extends SvgRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;

		this.addAutoEvent(this.game.isInDebugMode, 'change', () => this.updateDebugMode(), true);
	}

	activateInternal() {
		this.group = this.draw.group();
		this.markers = this.group.group();
		this.arrowPrevGroup = this.createArrowGroup('go-back');
		this.arrowNextGroup = this.createArrowGroup('go-forward');

		this.markerTravel = null;
		this.loadImageRef('img/icon/marker-traveling.svg', (image) => {
			this.markerTravel = this.markers.group();
			const img = this.markerTravel.use(image);
			img.scale(5);
			this.renderParty();
		});

		this.markerStop = null;
		this.loadImageRef('img/icon/marker-stop.svg', (image) => {
			this.markerStop = this.markers.group();
			const img = this.markerStop.use(image);
			img.scale(5);
			this.renderParty();
		});

		this.arrowPrev = null;
		this.arrowNext = null;
		this.loadImageRef('img/icon/arrow.svg', (image) => {
			this.arrowPrev = this.arrowPrevGroup.use(image);
			this.arrowPrev.scale(5);
			this.arrowNext = this.arrowNextGroup.use(image);
			this.arrowNext.scale(5);
			this.renderArrows();
		});

	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
		this.markerTravel = null;
		this.markerStop = null;
		this.arrowPrev = null;
		this.arrowNext = null;
	}

	renderInternal() {
		if (this.model.partyCoordinates.isDirty || this.model.partyTraveling.isDirty) {
			this.renderParty();
		}
		if (this.model.partyTraveling.isDirty || this.model.currentLocation.isDirty) {
			this.renderArrows();
		}
	}

	renderParty() {
		if (!(this.markerTravel && this.markerStop)) {
			return;
		}

		if (this.model.partyTraveling.get()) {
			this.markerTravel.show();
			this.markerStop.hide();
		} else {
			this.markerTravel.hide();
			this.markerStop.show();
		}

		const pos = this.model.partyCoordinates;
		this.markers.center(pos.x, pos.y);
	}

	renderArrows() {
		if (!(this.arrowNext && this.arrowNextGroup)) {
			return;
		}

		if (this.model.partyTraveling.get() || this.model.currentLocation.isSet()) {
			this.arrowNextGroup.hide();
			this.arrowPrevGroup.hide();
			return;
		}

		this.arrowNextGroup.show();
		this.arrowPrevGroup.show();

		const diff = this.model.partyCoordinates.subtract(this.model.lastPartyCoordinates);
		diff.setSize(120);
		const rotation = this.model.lastPartyCoordinates.getRotationFromYAxis(this.model.partyCoordinates);

		const pos = this.model.partyCoordinates.add(diff);
		this.rotate(this.arrowNext, - rotation.getDegrees() + 180);
		this.arrowNextGroup.center(pos.x, pos.y);

		const pos2 = this.model.partyCoordinates.subtract(diff);
		this.rotate(this.arrowPrev, - rotation.getDegrees());
		this.arrowPrevGroup.center(pos2.x, pos2.y);
	}

	createArrowGroup(clickEventName) {
		const group = this.group.group();

		group.opacity(0.5);
		group.on('mouseover', () => {
			group.opacity(1);
		});
		group.on('mouseout', () => {
			group.opacity(0.5);
		});
		group.on('click', () => {
			this.model.triggerEvent(clickEventName);
		});

		return group;
	}

	updateDebugMode() {
		if (this.game.isInDebugMode.get()) {
			this.group.hide();
		} else {
			this.group.show();
		}
	}
}
