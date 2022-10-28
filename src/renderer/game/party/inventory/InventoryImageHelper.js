import Pixies from "../../../../class/basic/Pixies";
import * as THREE from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import Vector2 from "../../../../model/basic/Vector2";

export const IMAGE_SIZE = new Vector2(65, 65);

export default class ItemInventoryImageHelper {

	/**
	 *
	 * @param dom Element
	 * @param itemDef ItemDefinitionModel
	 * @param mesh Mesh
	 * @param onFinish (Image) => any
	 * @param onFail (string) => any
	 */
	static renderImage(dom, itemDef, mesh, onFinish, onFail) {
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

		const composer = new EffectComposer( renderer );
		const renderPass = new RenderPass( scene, camera );
		renderPass.clearColor = new THREE.Color( 0, 0, 0 );
		renderPass.clearAlpha = 0;

		composer.addPass( renderPass );

		const effectFXAA = new ShaderPass( FXAAShader );
		effectFXAA.uniforms[ 'resolution' ].value.set(1 / IMAGE_SIZE.x,1 /  IMAGE_SIZE.y);
		effectFXAA.material.transparent = true;
		composer.addPass( effectFXAA );

		const m = mesh.clone();
		const r = itemDef.itemRotation;
		m.rotation.set(r.x, r.y, r.z);
		scene.add(m);

		const horizontal = itemDef.cameraSize.get();
		const vertical = itemDef.cameraSize.get();
		camera.left = - horizontal;
		camera.right = horizontal;
		camera.bottom = - vertical;
		camera.top = vertical;
		camera.updateProjectionMatrix();

		const position = itemDef.cameraPosition;
		camera.position.set(position.x, position.y, position.z);
		camera.lookAt(0, 0, 0);
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
