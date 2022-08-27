import SvgRenderer from "../../basic/SvgRenderer";

export default class MapPartyRenderer extends SvgRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;


		this.lastRotation = 0;
	}

	activateInternal() {

		this.party = this.draw.group();
		this.arrow = null;

		const token = 'party-arrow';
		if (!this.refExists(token)) {
			this.game.assets.getAsset(
				'img/arrow.svg',
				(img) => {
					if (!this.refExists(token)) {
						const marker = this.getDefs().image(img.src);
						this.setRef(token, marker);
					}
					this.renderParty();
				}
			);
		}

	}

	deactivateInternal() {
		this.party.remove();
	}

	renderInternal() {
		this.renderParty();
	}

	renderParty() {
		if (!this.arrow) {
			this.arrow = this.party.use(this.getRef('party-arrow'));
			this.arrow.scale(3);
		}
		const pos = this.model.partyCoordinates;
		const last = this.model.lastPartyCoordinates;
		const rotation = last.getRotationFromYAxis(pos).add(Math.PI);
		this.party.center(pos.x, pos.y);
		this.arrow.rotate( - (rotation.getDegrees() - this.lastRotation));
		this.lastRotation = rotation.getDegrees();
	}

}
