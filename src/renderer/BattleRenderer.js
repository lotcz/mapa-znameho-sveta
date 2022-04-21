import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import CollectionRenderer from "./CollectionRenderer";
import BattleCharacterRenderer from "./BattleCharacterRenderer";
import Vector3 from "../node/Vector3";
import Vector2 from "../node/Vector2";
import GUIHelper from "../class/GUIHelper";

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

		this.onViewBoxChangeHandler = () => this.onViewBoxSizeChanged();
	}

	activateInternal() {
		this.container = this.addElement('div', ['battle', 'container']);
		this.bgCanvas = Pixies.createElement(this.container, 'canvas');
		this.context2d = this.bgCanvas.getContext('2d');

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.container.appendChild(this.renderer.domElement);
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.camera = new THREE.OrthographicCamera(-10,10, 10, -10);

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

		//this.scene.add(new THREE.CameraHelper(this.directLight.shadow.camera));

		const shadowMaterial = new THREE.ShadowMaterial({color:'#000000'})
		shadowMaterial.opacity = 0.5;
		shadowMaterial.side = THREE.FrontSide;
		shadowMaterial.shadowSide = THREE.FrontSide;
		this.floor = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), shadowMaterial);
		this.floor.receiveShadow = true;
		this.floor.position.set(0, 0, 0);
		this.floor.rotation.set(-Math.PI / 2, 0, 0);
		this.scene.add(this.floor);

		this.box = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: '#a080b0', opacity: 0.5, transparent: true}));
		this.box.rotation.set(-Math.PI / 2, 0, 0);
		this.box.position.y = 0.0001;
		this.scene.add(this.box);

		//this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		//this.orbitControls.update();

		this.composer = new EffectComposer( this.renderer );

		const renderPass = new RenderPass( this.scene, this.camera );
		this.composer.addPass( renderPass );

		this.effectFXAA = new ShaderPass( FXAAShader );
		this.effectFXAA.uniforms[ 'resolution' ].value.set(1 / this.game.viewBoxSize.x,1 / this.game.viewBoxSize.y);
		this.composer.addPass( this.effectFXAA );

		this.updateCanvasSize();
		this.updateRendererSize();
		this.game.viewBoxSize.addOnChangeListener(this.onViewBoxChangeHandler);

		this.game.assets.getAsset(
			this.model.battleMap.backgroundImage.get(),
			(img) => {
				this.bgImage = img;
			}
		);

		this.game.assets.getAsset(
			'img/texture/dirt.png',
			(img) => {
				const texture = new THREE.Texture();
				texture.image = img;
				texture.needsUpdate = true;
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(1, 1);
				const matTest = new THREE.MeshLambertMaterial({color: '#90a090', map:texture});
				const mt = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), matTest);
				mt.position.set(-26, 0.5, -1);
				this.scene.add(mt);
			}
		);

		this.gui = GUIHelper.createGUI();
		const coord = GUIHelper.addVector2(this.gui, this.model.coordinates, 'screen coords');
		this.currentTile = new Vector2();
		const til = GUIHelper.addVector2(this.gui, this.currentTile, 'tile');

		const cam = GUIHelper.addScaler(this.gui, this.camera, 'zoom', -10, 10);

		this.game.assets.getAsset(
			'img/palm-tree.png',
			(img) => {
				const texture = new THREE.Texture();
				texture.image = img;
				texture.needsUpdate = true;
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(1, 1);
				const sprite = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({transparent: true, map:texture}));
				sprite.position.set(-27, 2.5, -25);
				const target = sprite.position.clone().add(new THREE.Vector3(-1,1, -1));
				sprite.lookAt(target.x, target.y, target.z);
				this.scene.add(sprite);
			}
		);

	}

	deactivateInternal() {
		this.game.viewBoxSize.removeOnChangeListener(this.onViewBoxChangeHandler);
		this.gui.destroy();
		this.gui = null;
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
		if (this.model.coordinates.isDirty || this.model.zoom.isDirty) {
			this.renderBgImage();
		}

		if (this.model.coordinates.isDirty) {
			this.updateCameraPosition();
		}

		if (this.model.zoom.isDirty) {
			this.updateCameraZoom();
		}

		const corner = this.model.coordinates.subtract(this.game.viewBoxSize.multiply(0.5 / this.model.zoom.get()));
		const coords = corner.add(this.game.controls.mouseCoordinates.multiply(1/this.model.zoom.get()));
		const tile = this.model.battleMap.screenCoordsToTile(coords);
		this.box.position.x = tile.x;
		this.box.position.z = tile.y;
		this.currentTile.set(tile);

		this.composer.render();

	}

	renderBgImage() {
		this.context2d.clearRect(0, 0, this.context2d.canvas.width, this.context2d.canvas.height);
		this.context2d.drawImage(
			this.bgImage,
			this.model.coordinates.x - (0.5 * this.game.viewBoxSize.x / this.model.zoom.get()),
			this.model.coordinates.y - (0.5 * this.game.viewBoxSize.y / this.model.zoom.get()),
			this.game.viewBoxSize.x / this.model.zoom.get(),
			this.game.viewBoxSize.y / this.model.zoom.get(),
			0,
			0,
			this.game.viewBoxSize.x,
			this.game.viewBoxSize.y
		);
	}

	onViewBoxSizeChanged() {
		this.updateCanvasSize();
		this.renderBgImage();
		this.updateRendererSize();
	}

	updateCanvasSize() {
		this.bgCanvas.width = this.game.viewBoxSize.x;
		this.bgCanvas.height = this.game.viewBoxSize.y;
	}

	updateRendererSize() {
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.composer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);

		const pixelRatio = this.renderer.getPixelRatio();
		this.effectFXAA.material.uniforms[ 'resolution' ].value.x = 1 / (  this.game.viewBoxSize.x * pixelRatio );
		this.effectFXAA.material.uniforms[ 'resolution' ].value.y = 1 / (  this.game.viewBoxSize.y * pixelRatio );

		this.updateCameraSize();
	}

	updateCameraSize() {
		const pxPerUnit =  this.model.battleMap.tileSize.get();
		const horizontal = (this.game.viewBoxSize.x / 2) / pxPerUnit;
		const vertical = (this.game.viewBoxSize.y / 2) / pxPerUnit;
		this.camera.left = - horizontal;
		this.camera.right = horizontal;
		this.camera.bottom = - vertical;
		this.camera.top = vertical;
		this.camera.updateProjectionMatrix();
	}

	updateCameraZoom() {
		this.camera.zoom = this.model.zoom.get();
		this.camera.updateProjectionMatrix();
	}

	updateCameraPosition() {
		const xz = this.model.battleMap.screenCoordsToPosition(this.model.coordinates);
		const center = new Vector3(xz.x, 0, xz.y);
		//console.log(Math.floor(xz.x), Math.floor(xz.y));
		const position = center.add(new Vector3(-100, 100, -100));
		this.camera.position.set(position.x, position.y, position.z);
		this.camera.lookAt(center.x, center.y, center.z);
	}

}
