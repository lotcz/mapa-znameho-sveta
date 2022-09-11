import * as THREE from "three";
import RendererNode from "../../basic/RendererNode";
import AnimationHelper from "../../../class/animating/AnimationHelper";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import BattleItemSlotRenderer from "./BattleItemSlotRenderer";

export default class BattleCharacterRenderer extends RendererNode {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	/**
	 * @type {AnimationHelper|null}
	 */
	animation;

	constructor(game, model, scene) {
		super(game, model);

		this.model = model;
		this.scene = scene;

		this.animation = null;

	}

	activateInternal() {
		const character = this.model.character.get();
		this.group = new THREE.Group();
		const scale = character.scale;
		this.group.scale.set(scale.x, scale.y, scale.z);

		this.scene.add(this.group);

		const race = this.game.resources.races.getById(character.raceId.get());
		const materialId = race.skinMaterialId.get();

		this.game.assets.getAsset(`mat/${materialId}`, (material) => {
			const skinMaterial = material;
			skinMaterial.side = THREE.DoubleSide;
			const modelId = character.sex.get() ? race.male3dModelId.get() : race.female3dModelId.get();
			const model = this.game.resources.models3d.getById(modelId);
			this.game.assets.getAsset(
				model.uri.get(),
				(asset) => {
					if (this.group) {
						//console.log(asset);
						this.animation = new AnimationHelper(SkeletonUtils.clone(asset.scene), asset.animations);
						this.switchAnimation(this.model.state.get());
						this.animation.mesh.traverse((mesh) => {
							if (mesh.material && mesh.geometry) {
								mesh.material.dispose();
								mesh.material = skinMaterial;
								mesh.castShadow = true;
								mesh.receiveShadow = false;
							}
						});
						const scale = race.scale;
						this.animation.mesh.scale.set(scale.x, scale.y, scale.z);
						this.group.add(this.animation.mesh);

						this.resetChildren();
						this.addChild(new BattleItemSlotRenderer(this.game, character.inventory.head, this.animation.mesh));
						this.addChild(new BattleItemSlotRenderer(this.game, character.inventory.leftHand, this.animation.mesh));
						this.addChild(new BattleItemSlotRenderer(this.game, character.inventory.rightHand, this.animation.mesh));
						this.updatePosition();
						this.updateRotation();
						this.switchAnimation();
						this.animation.update();
					}
				}
			);
		});
	}

	deactivateInternal() {
		this.resetChildren();
		if (this.animation) {
			this.animation.mesh.traverse((mesh) => {
				if (mesh.geometry) {
					mesh.geometry.dispose();
				}
			});
			this.group.remove(this.animation.mesh);
		}
		this.scene.remove(this.group);
		this.group = null;
	}

	renderInternal() {
		if (this.model.position.isDirty) {
			this.updatePosition();
		}

		if (this.model.rotation.isDirty) {
			this.updateRotation();
		}

		if (this.model.state.isDirty) {
			this.switchAnimation();
		}

		if (this.animation) {
			this.animation.update();
		}

	}

	switchAnimation() {
		if (this.animation) {
			this.animation.activateAction(this.model.state.get(), 250, false);
		}
	}

	updatePosition() {
		this.group.position.set(this.model.position.x, 0, this.model.position.y);
	}

	updateRotation() {
		this.group.rotation.set(0, this.model.rotation.get(), 0);
	}
}
