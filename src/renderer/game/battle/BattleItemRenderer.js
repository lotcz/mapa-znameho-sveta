import * as THREE from "three";
import RendererNode from "../../basic/RendererNode";

export default class BattleItemRenderer extends RendererNode {

	/**
	 * @type BattleItemModel
	 */
	model;

	constructor(game, model, scene) {
		super(game, model);

		this.model = model;
		this.scene = scene;

		this.group = null;
	}

	activateInternal() {
		this.group = new THREE.Group();
		this.group.scale.set(0.01, 0.01, 0.01);
		this.scene.add(this.group);

		if (this.model.item.isEmpty()) {
			console.log('No item to render.')
			return;
		}

		const item = this.model.item.get();
		this.game.assets.loadItemModel3d(
			item.definitionId.get(),
			(mesh) => {
				this.group.add(mesh.clone());
				this.updatePosition();
			}
		);
	}

	deactivateInternal() {
		this.scene.remove(this.group);
		this.group = null;
	}

	renderInternal() {
		if (this.model.position.isDirty) {
			this.updatePosition();
		}
	}

	updatePosition() {
		this.group.position.set(this.model.position.x, 0, this.model.position.y);
	}

}
