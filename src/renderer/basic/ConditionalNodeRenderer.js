import RendererNode from "./RendererNode";

export default class ConditionalNodeRenderer extends RendererNode {

	/**
	 * @type DirtyValue
	 */
	model;

	constructor(game, model, condition, rendererFactory, defaultRendererFactory = null) {
		super(game, model);
		this.model = model;
		this.condition = condition;
		this.rendererFactory = rendererFactory;
		this.defaultRendererFactory = defaultRendererFactory;
		this.renderer = null;
		this.isUsingDefaultRenderer = false;

		this.addAutoEvent(
			this.model,
			'change',
			() => this.updateRenderer(),
			true
		);
	}

	render() {
		if (!this.isActivated) {
			return;
		}
		if (this.renderer) {
			this.renderer.render();
		}
	}

	updateRenderer() {
		if (this.condition()) {
			if (this.isUsingDefaultRenderer || this.renderer === null) {
				this.resetChildren();
				this.renderer = this.addChild(this.rendererFactory());
				this.isUsingDefaultRenderer = false;
			}
		} else {
			if (this.defaultRendererFactory) {
				if (this.renderer === null || this.isUsingDefaultRenderer === false) {
					this.resetChildren();
					this.renderer = this.addChild(this.defaultRendererFactory());
					this.isUsingDefaultRenderer = true;
				}
			} else {
				this.resetChildren();
				this.renderer = null;
			}
		}
	}

}
