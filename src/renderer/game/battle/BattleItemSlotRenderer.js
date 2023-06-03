import RendererNode from "../../basic/RendererNode";
import {Object3D} from "three";
import CollectionRenderer from "../../basic/CollectionRenderer";

const BONES = {
	head: 'mixamorigHead',
	leftHand: 'mixamorigLeftHand',
	rightHand: 'mixamorigRightHand',
	body: 'mixamorigSpine2',
	hips: 'mixamorigHips',
	leftFoot: 'mixamorigLeftFoot',
	rightFoot: 'mixamorigRightFoot',
	leftLeg: 'mixamorigLeftUpLeg',
	rightLeg: 'mixamorigRightUpLeg',
	leftDownLeg: 'mixamorigLeftLeg',
	rightDownLeg: 'mixamorigRightLeg'
}

const CONVERSIONS = {
	hair: 'head',
	eyes: 'head',
	beard: 'head'
}

export default class BattleItemSlotRenderer extends RendererNode {

	/**
	 * @type ItemSlotModel
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

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.additionalItemsSlots,
				(m) => new BattleItemSlotRenderer(this.game, m, characterMesh)
			)
		);

		this.addAutoEvent(
			this.model.item,
			'change',
			() => this.updateMesh(),
			false
		);
	}

	activateInternal() {
		const boneName = this.getBoneName(this.model.name);
		this.bone = this.characterMesh.getObjectByName(boneName);
		if (this.game.isInDebugMode.get() && !this.bone) {
			console.log('No bone found', this.model.name, boneName);
			return;
		}
		this.updateMesh();
	}

	deactivateInternal() {
		this.clearDefinitionListener();
		this.destroyMesh();
	}

	getBoneName(name) {
		const converted = CONVERSIONS[name];
		if (converted) name = converted;
		return BONES[name];
	}

	updateMesh() {
		this.destroyMesh();
		if (this.model.item.isEmpty() || !this.bone) {
			return;
		}
		const item = this.model.item.get();

		const defId = item.definitionId.get();
		const itemDef = this.game.resources.itemDefinitions.getById(defId);
		if (!itemDef) {
			console.error(`Item definition ${defId} not found`);
			return;
		}
		if (
			itemDef.hideWhenAddingItems.get() &&
			itemDef.additionalItems.count() > 0 &&
			itemDef.additionalSlotName.equalsTo(this.model.name)
			) return;

		this.game.assets.loadItemModel3d(
			item.definitionId.get(),
			(mesh) => {
				this.destroyMesh();
				this.meshWrapper = new Object3D();
				this.mesh = mesh.clone();
				this.meshWrapper.add(this.mesh);
				this.bone.add(this.meshWrapper);

				if (item.primaryMaterialId.isSet()) {
					this.game.assets.loadMaterial(
						item.primaryMaterialId.get(),
						(material) => {
							this.mesh.traverse((mesh) => {
								if (mesh.material && mesh.geometry && (mesh.material.name === 'PrimaryMaterial' || mesh.userData.originalMaterialName === 'PrimaryMaterial')) {
									//mesh.material.dispose();
									mesh.material = material;
									mesh.castShadow = true;
									mesh.receiveShadow = false;
									mesh.material.needsUpdate = true;
								}
							});
						}
					);
				}

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
		if (!(this.definition && this.mesh)) {
			return;
		}

		let position, rotation;
		if (this.model.name.startsWith('right')) {
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
