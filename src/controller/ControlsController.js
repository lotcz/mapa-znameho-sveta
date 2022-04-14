import ControllerNode from "../node/ControllerNode";

export default class ControlsController extends ControllerNode {
	dom;

	/**
	 * @type ControlsModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model);

		this.model = model;
		this.dom = dom || window.document.body;
	}

	activateInternal() {
		this.deactivateInternal();
		this.dom.addEventListener('mousemove', (e) => this.onMouseMove(e));
		this.dom.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
		this.dom.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
		this.dom.addEventListener('mousedown', (e) => this.updateMouseButtons(e));
		this.dom.addEventListener('mouseup', (e) => this.updateMouseButtons(e));
		this.dom.addEventListener('wheel', (e) => this.onZoom(e), {passive: true});
		window.addEventListener('keydown', (e) => this.onKeyDown(e), false );
		window.addEventListener('keyup', (e) => this.onKeyUp(e), false );
		window.addEventListener('contextmenu', (e) => this.onContextMenu(e), false );
	}

	deactivateInternal() {

	}

	onKeyDown(event) {
		//this.caps = event.getModifierState("CapsLock");
		//console.log(event);
		const key = event.keyCode ? event.keyCode : event.charCode;
		switch (key) {
			case 13: /*Enter*/
				//this.model.interacting.set(true);
				break;
			case 27: /*Ecs*/ //this.model.menuRequested.set(true); break;
			case 192: /*~*/ //this.model.triggerEvent('debug-key'); break;
		}
	}

	onKeyUp(event) {
		//this.caps = event.getModifierState("CapsLock");
		const key = event.keyCode ? event.keyCode : event.charCode;
		//console.log("key:" + key);
		switch( key ) {
			case 13: /*Enter*/
				//this.model.interacting.set(false);
				break;
			case 192: /*~*/ this.model.triggerEvent('debug-key'); break;
		}
		//this.makeDirty();

	}


	onMouseMove(e) {
		this.model.mouseCoordinates.set(e.offsetX, e.offsetY);
		this.model.isMouseOver.set(true);
	}

	onMouseEnter() {
		this.model.isMouseOver.set(true);
	}

	onMouseLeave() {
		this.model.isMouseOver.set(false);
		this.model.mouseDownLeft.set(false);
		this.model.mouseDownRight.set(false);
	}

	onContextMenu(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	updateMouseButtons(e) {
		const left = ((e.buttons == 1) || (e.buttons == 3));
		const right = (e.buttons == 2);
		this.model.mouseDownLeft.set(left);
		this.model.mouseDownRight.set(right);
	}

	onZoom(e) {
		this.model.triggerEvent('zoom', e.deltaY > 0 ? 1 : -1);
	}

}
