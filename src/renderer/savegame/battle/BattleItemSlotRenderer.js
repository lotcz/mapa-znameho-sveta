import RendererNode from "../../basic/RendererNode";
import {Object3D} from "three";

const BONES = {
	head: 'mixamorigHead',
	leftHand: 'mixamorigLeftHand',
	rightHand: 'mixamorigRightHand'
}

export default class BattleItemSlotRenderer extends RendererNode {

	/**
	 * @type InventorySlotModel
	 */
	model;

	/**
	 * @type Mesh
	 */
	characterMesh;

	constructor(game, model, characterMesh) {
		super(game, model);

		this.model = model;
		this.characterMesh = characterMesh;

		this.mesh = null;
		this.definition = null;
		this.defChangedHandler = () => this.updateBonePosition();
	}

	activateInternal() {
		const boneName = BONES[this.model.name];
		this.bone = this.characterMesh.getObjectByName(boneName);
		if (!this.bone) {
			console.log('No bone found', this.model.name, boneName);
			return;
		}
		this.updateMesh();
	}

	deactivateInternal() {
		this.clearDefinitionListener();
		this.destroyMesh();
	}

	renderInternal() {
		if (this.model.item.isDirty) {
			this.updateMesh();
		}
	}

	updateMesh() {
		this.destroyMesh();
		if (this.model.item.isEmpty() || !this.bone) {
			return;
		}
		const item = this.model.item.get();
		this.game.assets.getAsset(
			`it3/${item.definitionId.get()}`,
			(mesh) => {
				this.destroyMesh();
				this.meshWrapper = new Object3D();
				this.mesh = mesh.clone();
				this.meshWrapper.add(this.mesh);
				this.bone.add(this.meshWrapper);

				this.clearDefinitionListener();
				this.definition = this.game.resources.itemDefinitions.getById(item.definitionId.get());
				this.definition.addOnDirtyListener(this.defChangedHandler);
				this.updateBonePosition();
			}
		);
	}

	destroyMesh() {
		if (this.mesh) {
			this.mesh.removeFromParent();
			this.mesh = null;
		}
	}

	updateBonePosition() {
		let position, rotation;
		if (this.model.name === 'rightHand') {
			position = this.definition.altMountingPosition;
			rotation = this.definition.altMountingRotation;
		} else {
			position = this.definition.mountingPosition;
			rotation = this.definition.mountingRotation;
		}
		this.meshWrapper.position.set(position.x, position.y, position.z);
		this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
	}

	clearDefinitionListener() {
		if (this.definition) {
			this.definition.removeOnDirtyListener(this.defChangedHandler);
		}
	}
}
