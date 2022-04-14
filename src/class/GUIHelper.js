import * as dat from "dat.gui";

export default class GUIHelper {

	static createGUI() {
		return new dat.GUI();
	}

	static addVector3(gui, object, property, min, max, step) {
		const folder = gui.addFolder(property);
		const vector = object[property];
		GUIHelper.addScale(folder, vector, 'x', min, max, step);
		GUIHelper.addScale(folder, vector, 'y', min, max, step);
		GUIHelper.addScale(folder, vector, 'z', min, max, step);
		return folder;
	}

	static addRotationVector3(gui, object, property) {
		return GUIHelper.addVector3(gui, object, property, -Math.PI, Math.PI, Math.PI / 180);
	}

	static addScaleVector3(gui, object, property) {
		return GUIHelper.addVector3(gui, object, property, 0, 25, 0.1);
	}

	static addScale(gui, object, property, min, max, step) {
		return gui.add(object, property, min, max, step);
	}
}
