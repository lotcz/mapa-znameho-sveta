import DomRenderer from "./DomRenderer";
import Pixies from "../../class/basic/Pixies";
import * as THREE from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import Vector2 from "../../model/basic/Vector2";
import GUIHelper from "../../class/basic/GUIHelper";

export const IMAGE_SIZE = new Vector2(80, 80);

export default class ItemDefinitionRenderer extends DomRenderer {

	/**
	 * @type ItemDefinitionModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'bg item-def');
		this.slot = Pixies.createElement(this.container, 'div', 'slot');
		this.inner = Pixies.createElement(this.slot, 'div', 'inner');

		this.gui = GUIHelper.createGUI();
		const position = GUIHelper.addVector3(this.gui, this.model.cameraPosition, 'camera position', -10, 10, 0.1);
		position.open();
		const quaternion = GUIHelper.addQuaternion(this.gui, this.model.cameraQuaternion, 'camera quaternion');
		quaternion.open();

		this.updateImage();
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.gui.destroy();
		this.gui = null;
	}

	renderInternal() {
		this.updateImage();
	}

	updateImage() {
		const itemDef = this.model;
		const modelId = itemDef.modelId.get();
		const model = this.game.resources.models3d.getById(modelId);
		if (!model) {
			console.log('No model to render');
			return;
		}
		this.game.assets.getAsset(model.uri.get(), (gltf) => {
			ItemDefinitionRenderer.renderImage(
				this.inner,
				itemDef,
				gltf,
				(img) => {
					Pixies.emptyElement(this.inner);
					this.inner.appendChild(img);
				},
				(msg) => console.log('Model loading failed', model.uri.get(), msg));
		});
	}

	static renderImage(dom, itemDef, gltf, onFinish, onFail) {
		const container = Pixies.createElement(dom, 'div', 'hidden');
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true});
		container.appendChild(renderer.domElement);
		renderer.setSize(IMAGE_SIZE.x, IMAGE_SIZE.y);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-10,10, 10, -10);

		const ambientLight = new THREE.AmbientLight(0xe0e0e0);
		scene.add(ambientLight);

		const directLight = new THREE.DirectionalLight( 0xe0e0e0, 1);
		directLight.position.set( 0, 10, 0 );
		directLight.castShadow = true;
		directLight.shadow.bias = 0;
		directLight.shadow.camera.near = 0.5;
		directLight.shadow.camera.far = 25;
		directLight.shadow.camera.right = 15;
		directLight.shadow.camera.left = -15;
		directLight.shadow.camera.top	= 15;
		directLight.shadow.camera.bottom = - 15;
		directLight.shadow.mapSize.width = 1024;
		directLight.shadow.mapSize.height = 1024;
		scene.add(directLight);

		//this.scene.add(new THREE.CameraHelper(this.directLight.shadow.camera));
		//this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		//this.orbitControls.update();

		const composer = new EffectComposer( renderer );
		const renderPass = new RenderPass( scene, camera );
		renderPass.clearColor = new THREE.Color( 0, 0, 0 );
		renderPass.clearAlpha = 0;

		composer.addPass( renderPass );

		const effectFXAA = new ShaderPass( FXAAShader );
		effectFXAA.uniforms[ 'resolution' ].value.set(1 / IMAGE_SIZE.x,1 /  IMAGE_SIZE.y);
		effectFXAA.material.transparent = true;
		composer.addPass( effectFXAA );

		const mesh = gltf.scene.clone();
		scene.add(mesh);

		const horizontal = itemDef.cameraSize.get();
		const vertical = itemDef.cameraSize.get();
		camera.left = - horizontal;
		camera.right = horizontal;
		camera.bottom = - vertical;
		camera.top = vertical;
		camera.updateProjectionMatrix();

		const position = itemDef.cameraPosition;
		camera.position.set(position.x, position.y, position.z);
		const quat = itemDef.cameraQuaternion;
		camera.setRotationFromQuaternion(new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w));
		composer.render();

		const image = new Image();
		image.onload = () => onFinish(image);
		image.onerror = (msg) => onFail(msg);
		image.src = renderer.domElement.toDataURL();

		ambientLight.dispose();
		directLight.dispose();
		renderer.dispose();
		Pixies.destroyElement(container);
	}
}
