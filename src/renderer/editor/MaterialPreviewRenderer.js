import Pixies from "../../class/basic/Pixies";
import DomRenderer from "../basic/DomRenderer";
import * as THREE from "three";
import {BoxGeometry, SphereGeometry} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import Vector2 from "../../model/basic/Vector2";
import Vector3 from "../../model/basic/Vector3";

const PREVIEW_SIZE = new Vector2(350, 350);

export default class MaterialPreviewRenderer extends DomRenderer {

	/**
	 * @type MaterialModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
		this.scene = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'bg item-def');
		this.buttons = Pixies.createElement(this.container,'div', 'buttons');
		this.close = Pixies.createElement(this.buttons, 'button', null, 'Close', () => this.game.editor.activeMaterial.set(null));

		this.paper = Pixies.createElement(this.container, 'div', 'paper');
		this.inner = Pixies.createElement(this.paper, 'div', 'inner');
/*
		this.gui = GUIHelper.createGUI();
		const position = GUIHelper.addVector3(this.gui, this.model.mountingPosition, 'mounting position', -30, 30, 0.1);
		position.open();
		const quaternion = GUIHelper.addVector3(this.gui, this.model.mountingRotation, 'mounting quaternion', -Math.PI, Math.PI, Math.PI/180);
		quaternion.open();
		const position2 = GUIHelper.addVector3(this.gui, this.model.altMountingPosition, 'alt mounting position', -30, 30, 0.1);
		position2.open();
		const quaternion2 = GUIHelper.addVector3(this.gui, this.model.altMountingRotation, 'alt mounting quaternion', -Math.PI, Math.PI, Math.PI/180);
		quaternion2.open();
*/
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.inner.appendChild(this.renderer.domElement);
		this.renderer.setSize(PREVIEW_SIZE.x, PREVIEW_SIZE.y);
		this.scene = new THREE.Scene();

		const horizontal = 3;
		const vertical = 3;

		this.camera = new THREE.OrthographicCamera(-horizontal, horizontal, -vertical, vertical);
		this.camera.updateProjectionMatrix();

		const camPosition = new Vector3(-100, 100, -100);
		this.camera.position.set(camPosition.x, camPosition.y, camPosition.z);
		this.camera.lookAt(0, 0, 0);

		this.ambientLight = new THREE.AmbientLight(0xe0e0e0);
		this.scene.add(this.ambientLight);

		this.directLight = new THREE.DirectionalLight( 0xe0e0e0, 1);
		this.directLight.position.set( 0, 10, 0 );
		this.directLight.castShadow = true;
		this.directLight.shadow.bias = 0;
		this.directLight.shadow.camera.near = 0.5;
		this.directLight.shadow.camera.far = 25;
		this.directLight.shadow.camera.right = 15;
		this.directLight.shadow.camera.left = -15;
		this.directLight.shadow.camera.top	= 15;
		this.directLight.shadow.camera.bottom = - 15;
		this.directLight.shadow.mapSize.width = 1024;
		this.directLight.shadow.mapSize.height = 1024;
		this.scene.add(this.directLight);
/*
		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		this.orbitControls.update();
*/
		this.composer = new EffectComposer(this.renderer);
		this.composer.setSize(PREVIEW_SIZE.x, PREVIEW_SIZE.y);

		const renderPass = new RenderPass(this.scene, this.camera);
		renderPass.clearColor = new THREE.Color( 0, 0, 0 );
		renderPass.clearAlpha = 0;
		this.composer.addPass( renderPass );

		this.effectFXAA = new ShaderPass( FXAAShader );
		this.effectFXAA.uniforms[ 'resolution' ].value.set(1 / PREVIEW_SIZE.x,1 / PREVIEW_SIZE.y);
		this.effectFXAA.material.transparent = true;
		this.composer.addPass( this.effectFXAA );

		const pixelRatio = this.renderer.getPixelRatio();
		this.effectFXAA.material.uniforms[ 'resolution' ].value.x = 1 / ( PREVIEW_SIZE.x * pixelRatio );
		this.effectFXAA.material.uniforms[ 'resolution' ].value.y = 1 / ( PREVIEW_SIZE.y * pixelRatio );

		this.updatePreview();
	}

	deactivateInternal() {
		this.ambientLight.dispose();
		this.ambientLight = null;
		this.directLight.dispose();
		this.directLight = null;
		this.scene = null;
		this.renderer.dispose();
		this.renderer = false;
		this.removeElement(this.container);
		if (this.gui) {
			this.gui.destroy();
			this.gui = null;
		}
	}

	renderInternal() {
		this.updatePreview();
	}

	updatePreview() {
		this.game.assets.resetMaterial(this.model.id.get());
		this.game.assets.loadMaterial(
			this.model.id.get(),
			(material) => {
				if (this.ball) {
					this.ball.removeFromParent();
				}
				this.ball = new THREE.Mesh(
					new SphereGeometry(),
					material
				);
				this.scene.add(this.ball);

				if (this.box) {
					this.box.removeFromParent();
				}
				this.box = new THREE.Mesh(
					new BoxGeometry(),
					material
				);
				this.box.position.set(-10, -10, -10);
				this.scene.add(this.box);
				this.composer.render();
			}
		)
		//this.orbitControls.update();
		//this.battleCharacter.position.makeDirty();
		//this.battleCharacter.rotation.makeDirty();
		//this.battleCharacterRenderer.render();

	}

}
