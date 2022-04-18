import * as dat from "dat.gui";

export default class GUIHelper {

	static createGUI() {
		return new dat.GUI();
	}

	static addVector3(gui, object, property, min, max, step, onChange = null) {
		const folder = gui.addFolder(property);
		const vector = object[property];
		GUIHelper.addScaler(folder, vector, 'x', min, max, step, onChange);
		GUIHelper.addScaler(folder, vector, 'y', min, max, step, onChange);
		GUIHelper.addScaler(folder, vector, 'z', min, max, step, onChange);
		return folder;
	}

	static addRotationVector3(gui, object, property) {
		return GUIHelper.addVector3(gui, object, property, -Math.PI, Math.PI, Math.PI / 180);
	}

	static addScaleVector3(gui, object, property) {
		return GUIHelper.addVector3(gui, object, property, 0, 25, 0.1);
	}

	static addScaler(gui, object, property, min, max, step, onChange = null) {
		const item = gui.add(object, property, min, max, step);
		if (onChange) item.onChange(onChange);
		return item;
	}
}
