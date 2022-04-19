import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {TransformControls} from "three/examples/jsm/controls/TransformControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import GUIHelper from "../class/GUIHelper";
import {SEX_FEMALE, SEX_MALE} from "../model/CharacterPreviewModel";
import AnimationHelper from "../class/AnimationHelper";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

export default class ThreeRenderer extends DomRenderer {

	/**
	 * @type CharacterPreviewModel
	 */
	model;

	/**
	 * @type {AnimationHelper|null}
	 */
	animation;


	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.alwaysRender = true;
		this.animation = null;
		this.item = null;
	}

	activateInternal() {

		this.container = this.addElement('div', 'three');
		this.container.style.backgroundImage = `url('res/img/camp.jpg')`;
		this.container.style.backgroundSize = '100%';

		this.camera = new THREE.OrthographicCamera(-10,10, 10, -10, 0.01, 100 );
		//this.camera = new THREE.PerspectiveCamera( 45, this.model.size.x / this.model.size.y, 0.01, 100 );
		this.camera.position.set(0, 0, 10);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(this.model.size.x, this.model.size.y);
		this.renderer.shadowMap.enabled = true;
		//this.renderer.shadowMap.type = THREE.BasicShadowMap;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.container.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.group = new THREE.Group();
		this.scene.add( this.group );

		this.scene.add(new THREE.AmbientLight({color:'yellow'}));

		const light = new THREE.DirectionalLight( 0xffffff, 1);
		light.position.set( 0, 10, 0 );
		light.castShadow = true;
		light.shadow.camera.near = 0.5;
		light.shadow.camera.far = 25;
		light.shadow.camera.right = 15;
		light.shadow.camera.left = -15;
		light.shadow.camera.top	= 15;
		light.shadow.camera.bottom = - 15;
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;

		this.scene.add(light);

		this.scene.add( new THREE.CameraHelper( light.shadow.camera ) );

		const box = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.MeshPhongMaterial({color: '#a5a08a'}));
		box.position.set(-5, -0.5, 0);
		box.castShadow = false;
		box.receiveShadow = true;
		this.scene.add(box);

		const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.ShadowMaterial({color:'#505050'}));
		floor.receiveShadow = true;
		floor.position.set(5, -0.5, 0);
		this.scene.add(floor);

		const ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshPhongMaterial({color: '#05a08a'}));
		ball.position.set(0, 1, -2);
		ball.castShadow = true;
		ball.receiveShadow = true;
		this.scene.add(ball);

		const wall = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), new THREE.MeshPhongMaterial({color: '#a5a08a'}));
		wall.position.set(0, 1, -4);
		wall.castShadow = true;
		wall.receiveShadow = true;
		this.scene.add(wall);

		this.skinMaterial = new THREE.MeshLambertMaterial({color:this.model.skinColor.get()});

		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		//this.orbitControls.update();

		this.transformControls = new TransformControls( this.camera, this.renderer.domElement );
		//this.transformControls.addEventListener( 'change', () => this.render() );
		this.transformControls.addEventListener( 'dragging-changed', (event) => {
			this.orbitControls.enabled = ! event.value;
		});
		//this.scene.add(this.transformControls);

		this.composer = new EffectComposer( this.renderer );

		const renderPass = new RenderPass( this.scene, this.camera );
		this.composer.addPass( renderPass );

		this.params = {
			edgeStrength: 1.6,
			edgeGlow: 1,
			edgeThickness: 0.1,
			pulsePeriod: 0,
			rotate: false,
			animate: true,
			usePatternTexture: false,
			visibleEdgeColor: '#000000',
			hiddenEdgeColor: '#000000'
		};

		this.outlinePass = new OutlinePass( new THREE.Vector2(this.model.size.x, this.model.size.y), this.scene, this.camera );
		this.outlinePass.edgeStrength = Number( this.params.edgeStrength );
		this.outlinePass.edgeThickness = Number( this.params.edgeThickness );
		this.outlinePass.edgeGlow = Number( this.params.edgeGlow );
		this.outlinePass.visibleEdgeColor.set(this.params.visibleEdgeColor);
		this.outlinePass.hiddenEdgeColor.set(this.params.hiddenEdgeColor);
		this.outlinePass.selectedObjects = [];
		//this.composer.addPass( this.outlinePass );

		this.gui = GUIHelper.createGUI();

		this.gui.add(this.model.sex, 'value', [SEX_MALE, SEX_FEMALE]).name('sex').onChange((value) => {
			this.model.sex.makeDirty();
		});

		this.gui.addColor(this.model.skinColor, 'value' ).name('color')
			.onChange(() => this.model.skinColor.makeDirty());

		GUIHelper.addScaleVector3(this.gui, this.model.scale, 'scale');
		GUIHelper.addVector3(this.gui, this.model.itemScale, 'itemScale', 50, 200, 1);
		GUIHelper.addVector3(this.gui, this.model.itemPosition, 'itemPosition', -100, 100, 1);
		GUIHelper.addRotationVector3(this.gui, this.model.itemRotation, 'itemRotation');

		this.commands = {
			idle: () => this.switchAnimation('Idle'),
			sword: () => this.switchAnimation('Sword'),
			run: () => this.switchAnimation('Run')
		}

		this.gui.add(this.commands, 'idle');
		this.gui.add(this.commands, 'sword');
		this.gui.add(this.commands, 'run');

		const outlineFolder = this.gui.addFolder('Outline');

		outlineFolder.add( this.params, 'edgeStrength', 0, 30 ).onChange((value) => this.outlinePass.edgeStrength = Number(value));
		outlineFolder.add( this.params, 'edgeGlow', 0.0, 5 ).onChange((value) => this.outlinePass.edgeGlow = Number(value));
		outlineFolder.add( this.params, 'edgeThickness', 0.0, 5 ).onChange((value) => this.outlinePass.edgeThickness = Number( value ));
		outlineFolder.add( this.params, 'pulsePeriod', 0.0, 5 ).onChange((value) => this.outlinePass.pulsePeriod = Number( value ));
		outlineFolder.add( this.params, 'rotate' );
		outlineFolder.add( this.params, 'animate' );
		outlineFolder.add( this.params, 'usePatternTexture' ).onChange((value) => this.outlinePass.usePatternTexture = value);
		outlineFolder.addColor( this.params, 'visibleEdgeColor' ).onChange((value) => this.outlinePass.visibleEdgeColor.set(value));
		outlineFolder.addColor( this.params, 'hiddenEdgeColor' ).onChange((value) => this.outlinePass.hiddenEdgeColor.set(value));

		const effectFXAA = new ShaderPass( FXAAShader );
		effectFXAA.uniforms[ 'resolution' ].value.set(1 / this.model.size.x,1 / this.model.size.y);
		this.composer.addPass( effectFXAA );

		this.updateCharacter();
	}

	deactivateInternal() {
		Pixies.destroyElement(this.container);
		this.container = null;
		this.gui.destroy();
	}

	renderInternal() {

		if (this.model.sex.isDirty) {
			this.updateCharacter();
		}

		//this.orbitControls.update();

		if (this.params.rotate) {
			this.group.rotation.y = this.model.rotation.get() * 0.005;
		}

		if (this.model.scale.isDirty) {
			this.group.scale.set(this.model.scale.x, this.model.scale.y, this.model.scale.z);
		}

		if (this.params.animate && this.animation) {
			this.animation.update();
			//this.animation2.update({delta: 25})
		}

		if (this.item && (this.model.itemPosition.isDirty || this.model.itemScale.isDirty || this.model.itemRotation.isDirty)) {
			this.item.position.set(this.model.itemPosition.x, this.model.itemPosition.y, this.model.itemPosition.z);
			this.item.scale.set(this.model.itemScale.x, this.model.itemScale.y, this.model.itemScale.z);
			this.item.rotation.set(this.model.itemRotation.x, this.model.itemRotation.y, this.model.itemRotation.z);
		}

		if (this.model.skinColor.isDirty) {
			this.skinMaterial.color = new THREE.Color(this.model.skinColor.get());
		}

		this.composer.render();
		//this.renderer.render(this.scene, this.camera);
	}

	updateCharacter() {
		if (this.animation) {
			this.group.remove(this.animation.mesh);
			this.outlinePass.selectedObjects = [];
		}
		const uri = this.model.sex.equalsTo(SEX_MALE) ? 'animation/male.glb' : 'animation/female.glb';
		this.game.assets.getAsset(
			uri,
			(asset) => {
				if (this.group) {
					this.animation = new AnimationHelper(SkeletonUtils.clone(asset.scene), asset.animations);
					this.switchAnimation(Pixies.randomElement(['Idle', 'Run', 'Sword']));
					this.animation.mesh.traverse((mesh) => {
						if (mesh.material && mesh.geometry) {
							mesh.material = this.skinMaterial;
							mesh.castShadow = true;
							mesh.receiveShadow = false;
						}
					});
					this.group.add(this.animation.mesh);
					this.outlinePass.selectedObjects = [this.animation.mesh];

					this.game.assets.getAsset(
						'glb/axe.glb',
						(asset) => {
							if (this.animation) {
								const sword = asset;
								const hand = this.animation.mesh.getObjectByName('mixamorigRightHand');
								hand.add(sword);
								//this.item = sword;
								//this.model.itemPosition.makeDirty();
							}
						}
					);

					this.game.assets.getAsset(
						'glb/hair.glb',
						(asset) => {
							if (this.animation) {
								const hair = asset.clone();
								const head = this.animation.mesh.getObjectByName('mixamorigHead');
								head.add(hair);
								this.item = hair;

								//this.transformControls.attach(hair);
								this.model.itemScale.makeDirty();
							}
						}
					);

				}
			}
		);
	}

	switchAnimation(name) {
		if (this.animation) {
			this.animation.activateAction(name, 1000, false);
		}
	}

}
