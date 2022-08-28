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

		const token = 'marker';
		if (!this.refExists(token)) {
			this.game.assets.getAsset(
				'img/marker.svg',
				(img) => {
					const marker = this.getDefs().image(img.src);
					this.setRef(token, marker);
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
	}

	renderParty() {
		if (!this.marker) {
			this.marker = this.group.group();
			const img = this.marker.use(this.getRef('marker'));
			img.scale(3);
		}

		const pos = this.model.partyCoordinates;
		this.group.center(pos.x, pos.y);
	}

}
