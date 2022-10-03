import * as THREE from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader.js";
import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import CollectionRenderer from "../../basic/CollectionRenderer";
import BattleCharacterRenderer from "./BattleCharacterRenderer";
import Vector3 from "../../../model/basic/Vector3";
import {SVG} from "@svgdotjs/svg.js";
import NullableNodeRenderer from "../../basic/NullableNodeRenderer";
import BattleMapRenderer from "./BattleMapRenderer";
import BattleItemRenderer from "./BattleItemRenderer";
import BattleCursorRenderer from "./BattleCursorRenderer";
import BattleCharacterRingRenderer from "./BattleCharacterRingRenderer";
import ConditionalNodeRenderer from "../../basic/ConditionalNodeRenderer";

const DEBUG_BATTLE_RENDERER = false;

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
		this.animation = null;
		this.item = null;

		this.scene = null;

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.characters.selectedNode,
				(m) => new BattleCharacterRingRenderer(this.game, m, this.drawForeground)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.characters,
				(m) => new BattleCharacterRenderer(this.game, m, this.scene)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.items,
				(m) => new BattleItemRenderer(this.game, m, this.scene)
			)
		);

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.battleMap,
				(m) => {
					return new BattleMapRenderer(
						this.game,
						m,
						this.scene,
						this.drawBackground
					);
				}
			)
		);

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.isHoveringPartyCharacter,
				() => this.model.isHoveringPartyCharacter.get() || this.game.isInDebugMode.get(),
				() => new BattleCursorRenderer(
					this.game,
					this.model,
					this.drawForeground
				)
			)
		);

		this.addAutoEvent(
			this.game.isInDebugMode,
			'change',
			() => {
				this.model.isHoveringPartyCharacter.triggerEvent('change');
			}
		);

		this.onViewBoxChangeHandler = () => this.onViewBoxSizeChanged();
	}

	activateInternal() {
		this.container = this.addElement('div', 'battle container-host');
		this.container.addEventListener('mouseover', () => {
			this.model.isMouseOver.set(true);
		});
		this.container.addEventListener('mouseout', () => {
			this.model.isMouseOver.set(false);
		});

		// CANVAS
		this.bgCanvas = Pixies.createElement(this.container, 'canvas', 'container');
		this.context2d = this.bgCanvas.getContext('2d');

		// SVG
		this.draw = SVG().addTo(this.container);
		this.draw.addClass('battle-svg');
		this.draw.addClass('container');
		this.drawBackground = this.draw.group();
		this.drawForeground = this.draw.group();

		this.updateSvgSize();
		this.updateSvgViewBox();

		// THREE
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.container.appendChild(this.renderer.domElement);
		Pixies.addClass(this.renderer.domElement, 'container');
		this.renderer.setSize(this.game.mainLayerSize.x, this.game.mainLayerSize.y);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.scene = new THREE.Scene();
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

		const shadowMaterial = new THREE.ShadowMaterial({color:'#000000'})
		shadowMaterial.opacity = 0.5;
		shadowMaterial.side = THREE.FrontSide;
		shadowMaterial.shadowSide = THREE.FrontSide;
		this.floor = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), shadowMaterial);
		this.floor.receiveShadow = true;
		this.floor.position.set(0, 0, 0);
		this.floor.rotation.set(-Math.PI / 2, 0, 0);
		this.scene.add(this.floor);

		this.composer = new EffectComposer( this.renderer );

		const renderPass = new RenderPass( this.scene, this.camera );
		this.composer.addPass( renderPass );

		this.effectFXAA = new ShaderPass( FXAAShader );
		this.effectFXAA.uniforms[ 'resolution' ].value.set(1 / this.game.mainLayerSize.x,1 / this.game.mainLayerSize.y);
		this.composer.addPass( this.effectFXAA );

		this.updateCanvasSize();
		this.updateRendererSize();

		this.game.mainLayerSize.addOnChangeListener(this.onViewBoxChangeHandler);

		this.game.assets.getAsset(
			this.model.battleMap.get().backgroundImage.get(),
			(img) => {
				this.bgImage = img;
				this.updateCameraPosition();
				this.updateCameraZoom();
				this.renderBgImage();
				this.composer.render();
			}
		);
	}

	deactivateInternal() {
		this.game.mainLayerSize.removeOnChangeListener(this.onViewBoxChangeHandler);
		if (this.gui) {
			this.gui.destroy();
			this.gui = null;
		}
		this.ambientLight.dispose();
		this.ambientLight = null;
		this.directLight.dispose();
		this.directLight = null;
		this.floor.material.dispose();
		this.floor.geometry.dispose();
		this.floor = null;
		this.scene = null;
		this.renderer.dispose();
		this.renderer = null;
		this.composer = null;
		this.camera = null;
		this.bgImage = null;
		Pixies.destroyElement(this.bgCanvas);
		this.bgCanvas = null;
		this.canvas = null;
		this.context2d = null;
		this.draw.remove();
		this.draw = null;
		Pixies.destroyElement(this.draw);
		Pixies.destroyElement(this.container);
		this.container = null;
	}

	renderInternal() {
		if (this.model.coordinates.isDirty || this.model.zoom.isDirty) {
			this.renderBgImage();
			this.updateSvgViewBox();
		}

		if (this.model.coordinates.isDirty) {
			this.updateCameraPosition();
		}

		if (this.model.zoom.isDirty) {
			this.updateCameraZoom();
		}

		if (this.model.isHoveringNoGo.isDirty) {
			if (this.model.isHoveringNoGo.get()) {
				Pixies.addClass(this.container, 'no-go');
			} else {
				Pixies.removeClass(this.container, 'no-go');
			}
		}

		this.composer.render();
	}

	renderBgImage() {
		if (!this.context2d) {
			console.log('no context for bg rendering');
			return;
		}
		if (!this.bgImage) {
			console.log('no image loaded for bg rendering');
			return;
		}
		this.context2d.clearRect(0, 0, this.context2d.canvas.width, this.context2d.canvas.height);
		this.context2d.drawImage(
			this.bgImage,
			this.model.coordinates.x - (0.5 * this.game.mainLayerSize.x / this.model.zoom.get()),
			this.model.coordinates.y - (0.5 * this.game.mainLayerSize.y / this.model.zoom.get()),
			this.game.mainLayerSize.x / this.model.zoom.get(),
			this.game.mainLayerSize.y / this.model.zoom.get(),
			0,
			0,
			this.game.mainLayerSize.x,
			this.game.mainLayerSize.y
		);
	}

	onViewBoxSizeChanged() {
		this.updateCanvasSize();
		this.renderBgImage();
		this.updateRendererSize();
		this.updateSvgSize();
	}

	updateCanvasSize() {
		this.bgCanvas.width = this.game.mainLayerSize.x;
		this.bgCanvas.height = this.game.mainLayerSize.y;
	}

	updateRendererSize() {
		this.renderer.setSize(this.game.mainLayerSize.x, this.game.mainLayerSize.y);
		this.composer.setSize(this.game.mainLayerSize.x, this.game.mainLayerSize.y);

		const pixelRatio = this.renderer.getPixelRatio();
		this.effectFXAA.material.uniforms[ 'resolution' ].value.x = 1 / (  this.game.mainLayerSize.x * pixelRatio );
		this.effectFXAA.material.uniforms[ 'resolution' ].value.y = 1 / (  this.game.mainLayerSize.y * pixelRatio );

		this.updateCameraSize();
	}

	updateCameraSize() {
		const pxPerUnit = this.model.battleMap.get().tileSize.get();
		const horizontal = (this.game.mainLayerSize.x / 2) / pxPerUnit;
		const vertical = (this.game.mainLayerSize.y / 2) / pxPerUnit;
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
		const xz = this.model.battleMap.get().screenCoordsToPosition(this.model.coordinates);
		const center = new Vector3(xz.x, 0, xz.y);
		const position = center.add(new Vector3(-100, 100, -100));
		this.camera.position.set(position.x, position.y, position.z);
		this.camera.lookAt(center.x, center.y, center.z);
	}

	updateSvgSize() {
		this.draw.size(this.game.mainLayerSize.x, this.game.mainLayerSize.y);
	}

	updateSvgViewBox() {
		this.draw.viewbox(
			this.model.coordinates.x - (0.5 * this.game.mainLayerSize.x / this.model.zoom.get()),
			this.model.coordinates.y - (0.5 * this.game.mainLayerSize.y / this.model.zoom.get()),
			this.game.mainLayerSize.x / this.model.zoom.get(),
			this.game.mainLayerSize.y / this.model.zoom.get(),
		);
	}
}
