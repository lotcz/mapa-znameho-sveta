import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import DualImageRenderer from "../../basic/DualImageRenderer";
import {SVG} from "@svgdotjs/svg.js";

export default class SequenceRenderer extends DomRenderer {

	/**
	 * @type SequenceModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.container = this.addElement('div', 'sequence-container container-host container');

		this.bg = Pixies.createElement(this.container,'div', 'sequence-background container-host container');
		this.addChild(
			new DualImageRenderer(
				this.game,
				this.model.dualImage,
				this.bg
			)
		);

		this.overlay = SVG().addTo(this.container);
		this.overlay.addClass('sequence-overlay-svg');
		this.overlay.addClass('container');

		this.text = Pixies.createElement(this.container, 'div', 'sequence-text container');
		this.updateSize();

		// pre-load images
		const images = this.model.steps.filter((step) => step.image.isSet()).map((step) => step.image.get());
		const paths = Pixies.arrayUnique(images);
		paths.forEach((path) => this.game.assets.getAsset(path));
	}

	deactivateInternal() {
		this.resetChildren();
		this.overlay.remove();
		this.overlay = null;
		this.removeElement(this.container);
		this.container = null;
		this.bg = null;
		this.text = null;
	}

	renderInternal() {
		if (this.model.currentStep.isEmpty()) {
			return;
		}

		if (this.model.theatreSize.isDirty || this.model.theatreCoordinates.isDirty) {
			this.updateSize();
		}

		if (this.model.currentText.isDirty) {
			if (this.model.currentText.isSet()) {
				Pixies.emptyElement(this.text);
				Pixies.removeClass(this.text, 'fading-out');
				Pixies.createElement(this.text, 'div', null, this.model.currentText.get());
			} else {
				Pixies.addClass(this.text, 'fading-out');
			}
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
/*
		const radial = this.overlay.gradient(
			'radial',
			function(add) {
				add.stop(0, 'rgba(0, 0, 0, 1)');
				add.stop(0.95, 'rgba(0, 0, 0, 1)');
				add.stop(1, 'rgba(255, 255, 255, 1)');
			}
		);
*/

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
