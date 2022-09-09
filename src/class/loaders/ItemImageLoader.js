import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";
import * as THREE from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import Vector3 from "../../model/basic/Vector3";

/**
 * Loads a single Image for item
 */
export default class ItemImageLoader extends AssetLoader {

	loadInternal() {

		const uri = this.uri.replace('itm/', '');

		this.assets.getAsset(uri, (gltf) => {
			const container = Pixies.createElement(window.document.body, 'div', 'hidden');
			const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true});
			container.appendChild(renderer.domElement);
			renderer.setSize(150, 150);
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
			effectFXAA.uniforms[ 'resolution' ].value.set(1 / 150,1 / 150);
			effectFXAA.material.transparent = true;
			composer.addPass( effectFXAA );

			const mesh = gltf.scene;
			scene.add(mesh);

			const center = new Vector3(0, 50, 0);
			//console.log(Math.floor(xz.x), Math.floor(xz.y));
			camera.position.set(center.x, center.y, center.z);
			camera.lookAt(0, 0, 0);

			const horizontal = 7;
			const vertical = 7;
			camera.left = - horizontal;
			camera.right = horizontal;
			camera.bottom = - vertical;
			camera.top = vertical;
			camera.updateProjectionMatrix();

			composer.render();

			const image = new Image();
			image.onload = () => this.finish(image);
			image.onerror = (msg) => this.fail(msg);
			image.src = renderer.domElement.toDataURL();
		});

	}

}
