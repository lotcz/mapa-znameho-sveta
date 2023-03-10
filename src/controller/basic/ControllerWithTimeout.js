import ControllerNode from "./ControllerNode";
import TimeoutController from "./TimeoutController";

export default class ControllerWithTimeout extends ControllerNode {

	runAfterTimeout(timeout, action) {
		return this.addChild(new TimeoutController(this.game, timeout, action));
	}

}
