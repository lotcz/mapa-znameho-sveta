import DomRenderer from "../../basic/DomRenderer";
import NullableNodeRenderer from "../../basic/NullableNodeRenderer";
import {SVG} from "@svgdotjs/svg.js";
import SequenceStepRenderer from "./SequenceStepRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class SequenceRenderer extends DomRenderer {

	/**
	 * @type SequenceModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.currentStep,
				(m) => new SequenceStepRenderer(this.game, m, this.bg, this.text)
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
		this.updateSize();
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

		const radial = this.overlay.gradient(
			'radial',
			function(add) {
				add.stop(0, 'rgba(0, 0, 0, 1)');
				add.stop(0.95, 'rgba(0, 0, 0, 1)');
				add.stop(1, 'rgba(255, 255, 255, 1)');
			}
		);

		this.clipCircle = this.overlay.circle(this.model.theatreSize.x).fill(radial);
		const center = size.multiply(0.5);
		this.clipCircle.center(center.x, center.y);
		this.clipPath = this.overlay.mask();
		this.clipPath.add(this.maskBg);
		this.clipPath.add(this.clipCircle);
		this.curtainContent.maskWith(this.clipPath);
	}

}
