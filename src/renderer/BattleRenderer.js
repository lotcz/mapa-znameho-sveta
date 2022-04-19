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
	}

	activateInternal() {

		this.dom.style.backgroundImage = `url('res/img/camp.jpg')`;
		this.dom.style.backgroundSize = '100%';

		this.camera = new THREE.OrthographicCamera(-10,10, 10, -10, 0.01, 100 );
		this.camera.position.set(0, 0, 10);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.dom.appendChild(this.renderer.domElement);

		this.scene.add(new THREE.AmbientLight());

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

		const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.ShadowMaterial({color:'#505050'}));
		floor.receiveShadow = true;
		floor.position.set(0, -0.5, 0);
		this.scene.add(floor);

		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		//this.orbitControls.update();

		this.composer = new EffectComposer( this.renderer );

		const renderPass = new RenderPass( this.scene, this.camera );
		this.composer.addPass( renderPass );

		const effectFXAA = new ShaderPass( FXAAShader );
		effectFXAA.uniforms[ 'resolution' ].value.set(1 / this.game.viewBoxSize.x,1 / this.game.viewBoxSize.y);
		this.composer.addPass( effectFXAA );

	}

	deactivateInternal() {
		Pixies.destroyElement(this.renderer.domElement);
		this.renderer = null;
		this.composer = null;
		this.camera = null;
	}

	renderInternal() {
		this.composer.render();
	}

}
