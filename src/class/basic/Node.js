import EventManager from "./EventManager";

export default class Node {

	/**
	 * @type EventManager
	 */
	eventManager;

	addEventListener(eventName, eventHandler, runImmediately = false) {
		if (!this.eventManager) {
			this.eventManager = new EventManager();
		}
		this.eventManager.addEventListener(eventName, eventHandler);
		if (runImmediately) {
			eventHandler();
		}
	}

	removeEventListener(eventName, eventHandler) {
		if (this.eventManager) {
			this.eventManager.removeEventListener(eventName, eventHandler);
		}
	}

	triggerEvent(eventName, param) {
		if (this.eventManager) {
			this.eventManager.triggerEvent(eventName, param);
		}
	}

}
