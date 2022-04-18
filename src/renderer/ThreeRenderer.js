import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import GUIHelper from "../class/GUIHelper";
import {SEX_FEMALE, SEX_MALE} from "../model/CharacterPreviewModel";

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
	}

	activateInternal() {

		//this.dom.style.backgroundImage = `url('${PaperImage}')`;

		this.camera = new THREE.OrthographicCamera(-10,10, 10, -10, 0.01, 100 );

		//this.camera = new THREE.PerspectiveCamera( 45, this.model.size.x / this.model.size.y, 0.01, 100 );
		this.camera.position.z = 10;
		this.camera.position.y = 5;

		this.scene = new THREE.Scene();

		this.group = new THREE.Group();
		this.scene.add( this.group );

		this.scene.add(new THREE.AmbientLight());
		this.scene.add(new THREE.DirectionalLight());

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(this.model.size.x, this.model.size.y);
		this.dom.appendChild(this.renderer.domElement);

		this.material = new THREE.MeshPhongMaterial({color:this.model.skinColor.get()});

		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );

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
		//this.outlinePass2.patternTexture = texture;
		this.outlinePass2.selectedObjects = [];
		this.composer.addPass( this.outlinePass2 );

		this.gui = GUIHelper.createGUI();

		this.gui.add(this.model.sex, 'value', [SEX_MALE, SEX_FEMALE]).name('sex').onChange((value) => {
			this.model.sex.makeDirty();
		});

		this.gui.addColor(this.model.skinColor, 'value' ).name('color')
			.onChange(() => this.model.skinColor.makeDirty());

		GUIHelper.addVector3(this.gui, this.model, 'scale', 0, 1, 0.1, () => this.model.scale.makeDirty());

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

		this.updateCharacter();
	}

	deactivateInternal() {
		Pixies.destroyElement(this.renderer.domElement);
		this.gui.destroy();
	}

	renderInternal() {

		if (this.model.sex.isDirty) {
			this.updateCharacter();
		}

		this.orbitControls.update();

		if (this.params.rotate) {
			this.group.rotation.y = this.model.rotation.get() * 0.005;
		}

		if (this.model.scale.isDirty) {
			this.group.scale.set(this.model.scale.x, this.model.scale.y, this.model.scale.z);
		}

		if (this.model.coordinates.isDirty) {
			this.dom.style.top = this.model.coordinates.x + 'px';
			this.dom.style.left = this.model.coordinates.y + 'px';
		}
		//this.renderer.render( this.scene, this.camera );
		//this.effect.render( this.scene, this.camera );
		//this.effect.renderOutline( this.scene, this.camera );

		if (this.params.animate && this.animation) {
			this.animation.update();
			//this.animation2.update({delta: 25})
		}

		if (this.model.skinColor.isDirty) {
			this.material.color = new THREE.Color(this.model.skinColor.get());
		}

		this.composer.render();

	}

	updateCharacter() {
		if (this.animation) {
			this.group.remove(this.animation.mesh);
			this.outlinePass2.selectedObjects = [];
		}
		const uri = this.model.sex.equalsTo(SEX_MALE) ? 'animation/male.glb' : 'animation/female.glb';
		this.game.assets.getAsset(
			uri,
			(asset) => {
				if (this.group) {
					this.animation = asset;
					this.animation.activateAction('Idle', 1000, false);
					this.animation.mesh.traverse((mesh) => {
						if (mesh.material && mesh.geometry) {
							mesh.material = this.material;
						}
					});
					this.group.add(this.animation.mesh);
					this.outlinePass2.selectedObjects = [this.animation.mesh];
					//this.render();
				}
			}
		);
	}


}
