import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import AnimationHelper from "../class/AnimationHelper";

import PaperImage from "../../res/img/paper.png";

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import GUIHelper from "../class/GUIHelper";


export default class ThreeRenderer extends DomRenderer {

	/**
	 * @type ThreeModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.gui = GUIHelper.createGUI();

		//this.dom.style.backgroundImage = `url('${PaperImage}')`;

		this.camera = new THREE.PerspectiveCamera( 45, this.model.size.x / this.model.size.y, 0.01, 10 );
		this.camera.position.z = 0.7;
		this.camera.position.y = 0.2;

		this.scene = new THREE.Scene();

		this.group = new THREE.Group();
		this.scene.add( this.group );

		this.scene.add(new THREE.AmbientLight());
		this.scene.add(new THREE.DirectionalLight());
/*
		const materials = [
			new THREE.MeshPhongMaterial({color:'#c79361'}),
			new THREE.MeshPhongMaterial({color:'#e1b48a'}),
			new THREE.MeshPhongMaterial({color:'#a52613'})
		];
*/

		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load('paper-texture.jpg');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 2, 2 );

		const materials = [
			new THREE.MeshBasicMaterial({map: texture}),
			new THREE.MeshToonMaterial({color:'#157010'}),
			new THREE.MeshToonMaterial({color:'#405040'})
		];

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(this.model.size.x, this.model.size.y);
		this.dom.appendChild(this.renderer.domElement);

		this.composer = new EffectComposer( this.renderer );

		const renderPass = new RenderPass( this.scene, this.camera );
		this.composer.addPass( renderPass );

		this.params = {
			edgeStrength: 5,
			edgeGlow: 0,
			edgeThickness: 0.1,
			pulsePeriod: 0,
			rotate: false,
			animate: true,
			usePatternTexture: false,
			visibleEdgeColor: '#000000',
			hiddenEdgeColor: '#000000'
		};

		this.outlinePass2 = new OutlinePass( new THREE.Vector2(this.model.size.x, this.model.size.y), this.scene, this.camera );
		this.outlinePass2.edgeStrength = Number( this.params.edgeStrength );
		this.outlinePass2.edgeThickness = Number( this.params.edgeThickness );
		this.outlinePass2.edgeGlow = Number( this.params.edgeGlow );
		this.outlinePass2.visibleEdgeColor.set(this.params.visibleEdgeColor);
		this.outlinePass2.hiddenEdgeColor.set(this.params.hiddenEdgeColor);
		this.outlinePass2.patternTexture = texture;
		this.outlinePass2.selectedObjects = [];
		this.composer.addPass( this.outlinePass2 );

		const outlineFolder = this.gui.addFolder('Outline');

		outlineFolder.add( this.params, 'edgeStrength', 0.1, 30 ).onChange((value) => this.outlinePass2.edgeStrength = Number(value));
		outlineFolder.add( this.params, 'edgeGlow', 0.0, 5 ).onChange((value) => this.outlinePass2.edgeGlow = Number(value));
		outlineFolder.add( this.params, 'edgeThickness', 0.1, 5 ).onChange((value) => this.outlinePass2.edgeThickness = Number( value ));
		outlineFolder.add( this.params, 'pulsePeriod', 0.0, 5 ).onChange((value) => this.outlinePass2.pulsePeriod = Number( value ));
		outlineFolder.add( this.params, 'rotate' );
		outlineFolder.add( this.params, 'animate' );
		outlineFolder.add( this.params, 'usePatternTexture' ).onChange((value) => this.outlinePass2.usePatternTexture = value);
		outlineFolder.addColor( this.params, 'visibleEdgeColor' ).onChange((value) => this.outlinePass2.visibleEdgeColor.set(value));
		outlineFolder.addColor( this.params, 'hiddenEdgeColor' ).onChange((value) => this.outlinePass2.hiddenEdgeColor.set(value));

		this.animation = new AnimationHelper( 'character.glb');
		this.animation.load().then((model) => {
			model.scale.set(10, 10, 10);

			model.position.x = -0.2;
			model.position.y = 0;
			model.position.z = -0.38;

			//model.rotation.x = -Math.PI;
			model.rotation.y = Math.PI/2;
			//model.rotation.z = 0;
			//console.log(model);

			const walk = this.gui.addFolder('Walking');
			GUIHelper.addVector3(walk, model, 'position', -2, 2, 0.01);
			GUIHelper.addRotationVector3(walk, model, 'rotation');
			GUIHelper.addScaleVector3(walk, model, 'scale');
			walk.open();

			this.outlinePass2.selectedObjects.push(model);

			model.traverse((mesh) => {
				if (mesh.material && mesh.geometry) {
					mesh.material = mesh.name.includes('Cylinder') ? materials[0] : materials[1];
					//console.log(mesh);
				}
			});
			this.group.add(model);

			const loader = new GLTFLoader();
			loader.load('helmet.glb', (gltf) => {
				const helmet = gltf.scene;
				helmet.traverse((mesh) => {
					if (mesh.material && mesh.geometry) {
						mesh.material = materials[2];
					}
				});

				helmet.scale.set(0.3, 0.3, 0.3);
				helmet.rotation.y = -1.6;
				helmet.position.x = -0.16;
				helmet.position.y = 0.13;

				const folder = this.gui.addFolder('Helmet');
				GUIHelper.addVector3(folder, helmet, 'position', -2, 2, 0.01);
				GUIHelper.addRotationVector3(folder, helmet, 'rotation');
				GUIHelper.addScaleVector3(folder, helmet, 'scale');

				const head = this.animation.model.getObjectByName('mixamorigHead');
				head.add(helmet);
				//this.scene.add(sword);
			});

			this.animation.activateAction('Walking', 1000);
		});

		this.animation2 = new AnimationHelper( 'character.glb');
		this.animation2.load().then((model) => {
			model.scale.set(10, 10, 10);
			model.position.x = 0.3;

			model.position.x = 0.29;
			model.position.y = 0;
			model.position.z = -0.52;

			//model.rotation.x = 1.51;
			model.rotation.y = Math.PI/2;
			//model.rotation.z = 0;

			const swing = this.gui.addFolder('Sword');
			GUIHelper.addVector3(swing, model, 'position', -2, 2, 0.01);
			GUIHelper.addRotationVector3(swing, model, 'rotation');
			GUIHelper.addScaleVector3(swing, model, 'scale');
			swing.open();

			//console.log(model);
			this.outlinePass2.selectedObjects.push(model);
			model.traverse((mesh) => {
				if (mesh.material && mesh.geometry) {
					mesh.material = mesh.name.includes('Cylinder') ? materials[0] : materials[1];
				}
			});
			this.group.add(model);

			this.animation2.activateAction('Sword', 1000);

			const loader = new GLTFLoader();
			loader.load('sword.glb', (gltf) => {
				const sword = gltf.scene;
				sword.scale.set(0.3, 0.3, 0.3);
				sword.rotation.x = -0.5 * Math.PI;
				sword.position.z = -0.3;
				const hand = this.animation2.model.getObjectByName('mixamorigRightHand');
				hand.add(sword);
				//this.scene.add(sword);
			});
		});

	}

	deactivateInternal() {
		Pixies.destroyElement(this.renderer.domElement);
	}

	renderInternal() {
		if (this.params.rotate) {
			this.group.rotation.y = this.model.rotation.get() * 0.005;
		}

		if (this.model.coordinates.isDirty) {
			this.dom.style.top = this.model.coordinates.x + 'px';
			this.dom.style.left = this.model.coordinates.y + 'px';
		}
		//this.renderer.render( this.scene, this.camera );
		//this.effect.render( this.scene, this.camera );
		//this.effect.renderOutline( this.scene, this.camera );

		if (this.params.animate) {
			this.animation.update({delta: 25})
			this.animation2.update({delta: 25})
		}

		this.composer.render();

	}


}
