import * as THREE from "three";
import RendererNode from "../../basic/RendererNode";

export default class BattleSprite3dRenderer extends RendererNode {

	/**
	 * @type BattleSprite3dModel
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
		this.scene.add(this.group);

		if (this.model.sprite3dId.isEmpty()) {
			console.log('No 3D sprite to render.')
			return;
		}

		this.game.assets.loadSprite3d(
			this.model.sprite3dId.get(),
			(sprite) => {
				this.group.add(sprite.clone());
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
