import * as dat from "dat.gui";

export default class GUIHelper {

	static createGUI() {
		return new dat.GUI();
	}

	static addVector2(gui, vector, name, min, max, step) {
		const folder = gui.addFolder(name);
		GUIHelper.addScaler(folder, vector, 'x', min, max, step);
		GUIHelper.addScaler(folder, vector, 'y', min, max, step);
		return folder;
	}

	static addVector3(gui, vector, name, min, max, step) {
		const folder = gui.addFolder(name);
		GUIHelper.addScaler(folder, vector, 'x', min, max, step);
		GUIHelper.addScaler(folder, vector, 'y', min, max, step);
		GUIHelper.addScaler(folder, vector, 'z', min, max, step);
		return folder;
	}

	static addQuaternion(gui, quat, name) {
		const min = -Math.PI;
		const max = Math.PI;
		const step = Math.PI/180;
		const folder = gui.addFolder(name);
		GUIHelper.addScaler(folder, quat, 'x', min, max, step);
		GUIHelper.addScaler(folder, quat, 'y', min, max, step);
		GUIHelper.addScaler(folder, quat, 'z', min, max, step);
		GUIHelper.addScaler(folder, quat, 'w', min, max, step);
		return folder;
	}

	static addRotationVector3(gui, object, name) {
		return GUIHelper.addVector3(gui, object, name, -Math.PI, Math.PI, Math.PI / 180);
	}

	static addScaleVector3(gui, object, name) {
		return GUIHelper.addVector3(gui, object, name, 0, 25, 0.1);
	}

	static addScaler(gui, object, property, min, max, step, onChange = null) {
		const item = gui.add(object, property, min, max, step).listen();
		item.onChange(() => {
				if (onChange) onChange();
				if (typeof object.makeDirty === 'function') object.makeDirty();
		});
		return item;
	}

}
