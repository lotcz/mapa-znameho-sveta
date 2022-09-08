import Pixies from "../../class/basic/Pixies";
import RendererNode from "./RendererNode";

const DEBUG_SVG_RENDERER = true;

export default class SvgRenderer extends RendererNode {
	draw;

	constructor(game, model, draw) {
		super(game, model);
		this.draw = draw;
	}

	getDefs() {
		return this.draw.root().defs();
	}

	refExists(uri) {
		const token = Pixies.token(uri);
		return this.getDefs().findOne('#' + token);
	}

	getRef(uri) {
		const token = Pixies.token(uri);
		const ref = this.getDefs().findOne('#' + token);
		if (!ref) {
			if (DEBUG_SVG_RENDERER) console.warn(`Resource ${uri} (token: ${token}) not found!`)
		}
		return ref;
	}

	setRef(uri, ref) {
		const token = Pixies.token(uri);
		const resource = this.getDefs().findOne('#' + token);
		if (!resource) {
			this.getDefs().add(ref);
			ref.attr({id:token});
		} else {
			if (DEBUG_SVG_RENDERER) console.log(`Resource ${uri} already loaded.`);
		}
	}

	loadImageRef(uri, onLoaded){
		if (this.refExists(uri)) {
			onLoaded(this.getRef(uri));
			return;
		}
		this.game.assets.getAsset(
			uri,
			(img) => {
				if (this.refExists(uri)) {
					onLoaded(this.getRef(uri));
					return;
				}
				const image = this.getDefs().image(img.src, () => {
					this.setRef(uri, image);
					onLoaded(image);
				});
			}
		);
	}

	rotate(element, rotation) {
		let lastRotation = element.remember('rotation');
		if (!lastRotation) {
			lastRotation = 0;
		}
		element.rotate(rotation - lastRotation);
		element.remember('rotation', rotation);
	}

}