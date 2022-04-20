import * as THREE from "three";
import {SEX_MALE} from "../model/CharacterPreviewModel";
import RendererNode from "../node/RendererNode";
import AnimationHelper from "../class/AnimationHelper";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import Pixies from "../class/Pixies";

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

		this.alwaysRender = true;
		this.animation = null;
		this.item = null;
	}

	activateInternal() {

		this.group = new THREE.Group();
		this.scene.add( this.group );

		this.skinMaterial = new THREE.MeshLambertMaterial({color:this.model.skinColor.get()});

		this.updateCharacter();
	}

	deactivateInternal() {
		this.skinMaterial.dispose();
		this.skinMaterial = null;
		if (this.animation) {
			this.animation.mesh.traverse((mesh) => {
				if (mesh.geometry) {
					mesh.geometry.dispose();
				}
			})
		}
		this.scene.remove(this.group);
		this.group = null;
	}

	renderInternal() {

		if (this.model.sex.isDirty) {
			this.updateCharacter();
		}

		if (this.model.coordinates.isDirty) {
			const tile = this.game.battle.battleMap.screenCoordsToTile(this.model.coordinates);
			this.group.position.set(tile.x, 0, tile.y);
		}

		if (this.model.rotation.isDirty) {
			this.group.rotation.set(this.model.rotation.x, this.model.rotation.y, this.model.rotation.z);
		}

		if (this.model.scale.isDirty) {
			this.group.scale.set(this.model.scale.x, this.model.scale.y, this.model.scale.z);
		}

		if (this.animation) {
			this.animation.update();
		}

		if (this.item && (this.model.itemPosition.isDirty || this.model.itemScale.isDirty || this.model.itemRotation.isDirty)) {
			this.item.position.set(this.model.itemPosition.x, this.model.itemPosition.y, this.model.itemPosition.z);
			this.item.scale.set(this.model.itemScale.x, this.model.itemScale.y, this.model.itemScale.z);
			this.item.rotation.set(this.model.itemRotation.x, this.model.itemRotation.y, this.model.itemRotation.z);
		}

		if (this.model.skinColor.isDirty) {
			this.skinMaterial.color = new THREE.Color(this.model.skinColor.get());
		}
	}

	switchAnimation(name) {
		if (this.animation) {
			this.animation.activateAction(name, 1000, false);
		}
	}

	updateCharacter() {
		if (this.animation) {
			this.group.remove(this.animation.mesh);
		}
		const uri = this.model.sex.equalsTo(SEX_MALE) ? 'animation/male.glb' : 'animation/female.glb';
		this.game.assets.getAsset(
			uri,
			(asset) => {
				if (this.group) {
					//console.log(asset);
					this.animation = new AnimationHelper(SkeletonUtils.clone(asset.scene), asset.animations);
					this.switchAnimation(Pixies.randomElement(['Idle', 'Run', 'Sword']));
					this.animation.mesh.traverse((mesh) => {
						if (mesh.material && mesh.geometry) {
							mesh.material.dispose();
							mesh.material = this.skinMaterial;
							mesh.castShadow = true;
							mesh.receiveShadow = false;
						}
					});
					this.group.add(this.animation.mesh);
					this.model.coordinates.makeDirty();

					this.game.assets.getAsset(
						'glb/hair.glb',
						(asset) => {
							if (this.animation) {
								const hair = asset.clone();
								const head = this.animation.mesh.getObjectByName('mixamorigHead');
								head.add(hair);
								this.item = hair;
								this.model.itemScale.makeDirty();
							}
						}
					);
				}
			}
		);
	}

}
