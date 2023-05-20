import * as THREE from "three";
import RendererNode from "../../basic/RendererNode";
import AnimationHelper from "../../../class/animating/AnimationHelper";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import BattleItemSlotRenderer from "./BattleItemSlotRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";

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

		this.character = null;
		this.race = null;

		this.animation = null;
		this.useSkinMaterial = false;
		this.skinMaterial = null;
	}

	resourceLoaded() {
		if (!this.group) {
			console.log('resources loaded after renderer deactivated');
			return;
		}

		if (this.children.length > 0) {
			console.log('resources loaded once again after initialized');
			return;
		}

		if (!this.animation) {
			return;
		}

		if (this.useSkinMaterial && !this.skinMaterial) {
			return;
		}

		if (this.skinMaterial) {
			this.animation.mesh.traverse((mesh) => {
				if (mesh.material && mesh.material.name === "SkinMaterial" && mesh.geometry) {
					mesh.material.dispose();
					mesh.material = this.skinMaterial;
					mesh.castShadow = true;
					mesh.receiveShadow = false;
				}
			});
		}

		const inner = new THREE.Group();
		inner.add(this.animation.mesh);
		const scale = this.race.scale;
		inner.scale.set(scale.x, scale.y, scale.z);
		this.group.add(inner);

		this.addChild(new BattleItemSlotRenderer(this.game, this.character.hairSlot, this.animation.mesh));
		this.addChild(new BattleItemSlotRenderer(this.game, this.character.beardSlot, this.animation.mesh));
		this.addChild(new BattleItemSlotRenderer(this.game, this.character.eyesSlot, this.animation.mesh));
		this.addChild(new BattleItemSlotRenderer(this.game, this.character.inventory.head, this.animation.mesh));
		this.addChild(new BattleItemSlotRenderer(this.game, this.character.inventory.leftHand, this.animation.mesh));
		this.addChild(new BattleItemSlotRenderer(this.game, this.character.inventory.rightHand, this.animation.mesh));
		this.addChild(new BattleItemSlotRenderer(this.game, this.character.inventory.body, this.animation.mesh));
		this.addChild(new BattleItemSlotRenderer(this.game, this.character.inventory.hips, this.animation.mesh));
		this.addChild(new BattleItemSlotRenderer(this.game, this.character.inventory.feet, this.animation.mesh));

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.character.additionalItemsSlots,
				(m) => new BattleItemSlotRenderer(this.game, m, this.animation.mesh)
			)
		);

		inner.userData.battleCharacter = this.model;
		const bounding = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.8, 0.5), new THREE.MeshBasicMaterial({visible: false, wireframe: true}));
		bounding.position.y = 0.9;
		inner.add(bounding);

		this.updatePosition();
		this.updateRotation();
		this.switchAnimation();
		this.animation.update();

	}

	activateInternal() {
		this.group = new THREE.Group();

		this.character = this.model.character.get();
		const scale = this.character.scale;
		this.group.scale.set(scale.x, scale.y, scale.z);

		this.scene.add(this.group);

		this.race = this.game.resources.races.getById(this.character.raceId.get());
		this.useSkinMaterial = this.race.skinMaterialId.isSet();

		const modelId = this.character.sex.get() ? this.race.male3dModelId.get() : this.race.female3dModelId.get();
		const model = this.game.resources.models3d.getById(modelId);
		this.game.assets.getAsset(
			model.uri.get(),
			(asset) => {
				this.animation = new AnimationHelper(SkeletonUtils.clone(asset.scene), asset.animations);
				this.resourceLoaded();
			}
		);


		if (!this.useSkinMaterial) {
			return;
		}

		const materialId = this.race.skinMaterialId.get();
		this.game.assets.getAsset(
			`mat/${materialId}`,
			(material) => {
				this.skinMaterial = material;
				this.skinMaterial.side = THREE.DoubleSide;
				this.resourceLoaded();
			}
		);
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
			this.animation = null;
		}

		this.scene.remove(this.group);
		this.group = null;
		this.skinMaterial = null;
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
