import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import CollectionRenderer from "./CollectionRenderer";
import BattleCharacterRenderer from "./BattleCharacterRenderer";

export default class BattleRenderer extends DomRenderer {

	/**
	 * @type BattleModel
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

		this.scene = new THREE.Scene();

		this.charactersRenderer = this.addChild(new CollectionRenderer(this.game, this.model.characters, (m) => new BattleCharacterRenderer(this.game, m, this.scene)));
		this.charactersRenderer.alwaysRender = true;

		this.onViewBoxChangeHandler = () => this.updateViewBoxSize();
	}

	activateInternal() {
		this.container = this.addElement('div', ['battle', 'container']);
		this.bgCanvas = Pixies.createElement(this.container, 'canvas');
		this.context2d = this.bgCanvas.getContext('2d');

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.container.appendChild(this.renderer.domElement);
		//this.renderer.autoClear = false;
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.camera = new THREE.OrthographicCamera(-10,10, 10, -10, 0.01, 100 );
		this.camera.position.set(0, 0, 10);

		this.game.assets.getAsset(
			'img/camp.jpg',
			(img) => {
				this.bgImage = img;
				this.updateViewBoxSize();
				this.game.viewBoxSize.addOnChangeListener(this.onViewBoxChangeHandler);
			}
		);

		this.ambientLight = new THREE.AmbientLight();
		this.scene.add(this.ambientLight);

		this.directLight = new THREE.DirectionalLight( 0xffffff, 1);
		this.directLight.position.set( 0, 10, 0 );
		this.directLight.castShadow = true;
		this.directLight.shadow.camera.near = 0.5;
		this.directLight.shadow.camera.far = 25;
		this.directLight.shadow.camera.right = 15;
		this.directLight.shadow.camera.left = -15;
		this.directLight.shadow.camera.top	= 15;
		this.directLight.shadow.camera.bottom = - 15;
		this.directLight.shadow.mapSize.width = 1024;
		this.directLight.shadow.mapSize.height = 1024;
		this.scene.add(this.directLight);

		const shadowMaterial = new THREE.ShadowMaterial({color:'#000000'})
		shadowMaterial.opacity = 0.5;
		this.floor = new THREE.Mesh(new THREE.BoxGeometry(15, 1, 15), shadowMaterial);
		this.floor.receiveShadow = true;
		this.floor.position.set(0, -0.5, 0);
		this.scene.add(this.floor);

		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		//this.orbitControls.update();

		this.composer = new EffectComposer( this.renderer );

		const renderPass = new RenderPass( this.scene, this.camera );
		this.composer.addPass( renderPass );

		this.effectFXAA = new ShaderPass( FXAAShader );
		this.effectFXAA.uniforms[ 'resolution' ].value.set(1 / this.game.viewBoxSize.x,1 / this.game.viewBoxSize.y);
		this.composer.addPass( this.effectFXAA );

	}

	deactivateInternal() {
		this.game.viewBoxSize.removeOnChangeListener(this.onViewBoxChangeHandler);
		this.ambientLight.dispose();
		this.ambientLight = null;
		this.directLight.dispose();
		this.directLight = null;
		this.floor.material.dispose();
		this.floor.geometry.dispose();
		this.floor = null;
		this.renderer.dispose();
		this.renderer = null;
		this.composer = null;
		this.camera = null;
		this.bgImage = null;
		Pixies.destroyElement(this.bgCanvas);
		this.canvas = null;
		this.context2d = null;
		Pixies.destroyElement(this.container);
		this.container = null;
	}

	renderInternal() {
		this.renderBgImage();
		this.composer.render();
	}

	updateViewBoxSize() {
		this.bgCanvas.width = this.game.viewBoxSize.x;
		this.bgCanvas.height = this.game.viewBoxSize.y;
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.composer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);

		const pixelRatio = this.renderer.getPixelRatio();
		this.effectFXAA.material.uniforms[ 'resolution' ].value.x = 1 / (  this.game.viewBoxSize.x * pixelRatio );
		this.effectFXAA.material.uniforms[ 'resolution' ].value.y = 1 / (  this.game.viewBoxSize.y * pixelRatio );
		//this.effectFXAA.uniforms[ 'resolution' ].value.set(1 / this.game.viewBoxSize.x,1 / this.game.viewBoxSize.y);
	}

	renderBgImage() {
		if (!this.bgImage) {
			console.warn('bg image not loaded!');
			return;
		}
		this.context2d.clearRect(0, 0, this.context2d.canvas.width, this.context2d.canvas.height);
		this.context2d.drawImage(
			this.bgImage,
			this.model.coordinates.x,
			this.model.coordinates.y,
			this.game.viewBoxSize.x,
			this.game.viewBoxSize.y,
			0,
			0,
			this.game.viewBoxSize.x,
			this.game.viewBoxSize.y
		);
	}

}
