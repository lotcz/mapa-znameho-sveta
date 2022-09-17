import * as THREE from "three";
import RendererNode from "../../basic/RendererNode";

export default class BattleSpriteRenderer extends RendererNode {

	/**
	 * @type BattleSpriteModel
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

		if (this.model.spriteId.isEmpty()) {
			console.log('No sprite to render.')
			return;
		}

		this.game.assets.loadSprite(
			this.model.spriteId.get(),
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
