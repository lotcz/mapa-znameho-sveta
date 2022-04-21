import DirtyValue from "../node/DirtyValue";
import Vector2 from "../node/Vector2";
import ModelNode from "../node/ModelNode";

const CLICK_TIMEOUT = 250;

export default class ControlsModel extends ModelNode {
	isMouseOver;
	mouseCoordinates;
	mouseDownLeft;
	mouseDownRight;
	leftClickTime;
	rightClickTime;

	constructor() {
		super();

		this.isMouseOver = this.addProperty('isMouseOver', new DirtyValue(false));
		this.mouseCoordinates = this.addProperty('mouseCoordinates', new Vector2());
		this.mouseDownLeft = this.addProperty('mouseDownLeft' , new DirtyValue(false));
		this.mouseDownLeft.addOnChangeListener((params) => this.onMouseLeftChange(params.newValue));
		this.mouseDownRight = this.addProperty('mouseDownRight' ,new DirtyValue(false));
		this.mouseDownRight.addOnChangeListener((params) => this.onMouseRightChange(params.newValue));

		this.leftClickTime = 0;
		this.rightClickTime = 0;
	}

	onMouseLeftChange(down) {
		const time = performance.now();
		if (down) {
			this.leftClickTime = time;
		} else {
			if ((time - this.leftClickTime) < CLICK_TIMEOUT) {
				this.triggerEvent('left-click', this.mouseCoordinates.clone());
			}
		}
	}

	onMouseRightChange(down) {
		const time = performance.now();
		if (down) {
			this.rightClickTime = time;
		} else {
			if ((time - this.rightClickTime) < CLICK_TIMEOUT) {
				this.triggerEvent('right-click', this.mouseCoordinates.clone());
			}
		}
	}

	addOnLeftClickListener(listener) {
		this.addEventListener('left-click', listener);
	}

	removeOnLeftClickListener(listener) {
		this.removeEventListener('left-click', listener);
	}

	addOnRightClickListener(listener) {
		this.addEventListener('right-click', listener);
	}

	removeOnRightClickListener(listener) {
		this.removeEventListener('right-click', listener);
	}

	addOnDebugKeyListener(listener) {
		this.addEventListener('debug-key', listener);
	}

	removeOnDebugKeyListener(listener) {
		this.removeEventListener('debug-key', listener);
	}

}
