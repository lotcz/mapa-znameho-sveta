import Pixies from "../class/Pixies";
import RendererNode from "../node/RendererNode";

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
		let ref = this.getDefs().findOne('#' + token);
		return ref;
	}

	getRef(uri) {
		const token = Pixies.token(uri);
		let ref = this.getDefs().findOne('#' + token);
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

}
