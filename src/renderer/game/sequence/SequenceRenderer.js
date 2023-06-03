import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import {SVG} from "@svgdotjs/svg.js";
import CollectionRenderer from "../../basic/CollectionRenderer";
import SequenceStepBackgroundRenderer from "./SequenceStepBackgroundRenderer";

export default class SequenceRenderer extends DomRenderer {

	/**
	 * @type SequenceModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.runningSteps,
				(m) => new SequenceStepBackgroundRenderer(this.game, m, this.bg)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'sequence-container container-host container');

		this.bg = Pixies.createElement(this.container,'div', 'sequence-background container-host container');

		this.overlay = SVG().addTo(this.container);
		this.overlay.addClass('sequence-overlay-svg');
		this.overlay.addClass('container');

		this.text = Pixies.createElement(this.container, 'div', 'sequence-text container');
		this.renderText();
		this.updateSize();

		this.game.assets.load(this.model.getResourcesForPreload());
	}

	deactivateInternal() {
		this.overlay.remove();
		this.overlay = null;
		this.removeElement(this.container);
		this.container = null;
		this.bg = null;
		this.text = null;
	}

	renderInternal() {
		if (this.model.theatreSize.isDirty || this.model.theatreCoordinates.isDirty) {
			this.updateSize();
		}

		if (this.model.text.isDirty) {
			this.renderText();
		}
	}

	renderText() {
		if (this.model.text.isSet()) {
			Pixies.emptyElement(this.text);
			Pixies.removeClass(this.text, 'fading-out');
			Pixies.createElement(this.text, 'div', null, this.model.text.get());
		} else {
			Pixies.addClass(this.text, 'fading-out');
		}
	}

	updateSize() {
		if (this.model.theatreSize.size() === 0) {
			return;
		}

		this.bg.style.left = this.model.theatreCoordinates.x + 'px';
		this.bg.style.top = this.model.theatreCoordinates.y + 'px';
		this.bg.style.width = this.model.theatreSize.x + 'px';
		this.bg.style.height = this.model.theatreSize.y + 'px';

		this.text.style.top = (this.model.theatreCoordinates.y + this.model.theatreSize.y) + 'px';
		this.text.style.left = this.model.theatreCoordinates.x + 'px';
		this.text.style.width = this.model.theatreSize.x + 'px';

		if (this.clipPath) {
			this.curtainContent.unmask();
			this.clipPath.remove();
			this.clipPath = null;
			this.curtainContent.remove();
			this.curtainContent = null;
			this.clipCircle.remove();
			this.clipCircle = null;
		}

		const size = this.game.viewBoxSize;
		this.overlay.size(size.x, size.y);
		this.curtainContent = this.overlay.rect(
			size.x,
			size.y
		).fill('black');
		this.maskBg = this.overlay.rect(
			size.x,
			size.y
		).fill('white');

		this.clipCircle = this.overlay
			.rect(this.model.theatreSize.x, this.model.theatreSize.y)
			.move(this.model.theatreCoordinates.x, this.model.theatreCoordinates.y)
			.fill('black')
			.radius(10);
		this.clipPath = this.overlay.mask();
		this.clipPath.add(this.maskBg);
		this.clipPath.add(this.clipCircle);
		this.curtainContent.maskWith(this.clipPath);
	}

}
