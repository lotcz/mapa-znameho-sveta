import Pixies from "../class/Pixies";
import RendererNode from "../node/RendererNode";

export default class SvgRenderer extends RendererNode {
	draw;

	constructor(game, model, draw) {
		super(game, model);
		this.draw = draw;
	}

	getDefs() {
		return this.draw.root().defs();
	}

	getRef(uri) {
		const token = Pixies.token(uri);
		let ref = this.getDefs().findOne('#' + token);
		if (!ref) {
			console.error(`Resource ${uri} (token: ${token}) not found!`)
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
			console.log(`Resource ${uri} already loaded.`);
			this.loaded = true;
		}
	}

}
