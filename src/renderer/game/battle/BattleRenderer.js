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
import ConditionalNodeRenderer from "../../basic/ConditionalNodeRenderer";
import BattleRingRenderer from "./BattleRingRenderer";
import {CURSOR_TYPES} from "../../../model/game/battle/BattleModel";

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
				this.model.partyCharacters.selectedNode,
				(m) => new BattleRingRenderer(this.game, m.position, this.drawForeground, true)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.partyCharacters,
				(m) => new BattleCharacterRenderer(this.game, m, this.scene)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.npcCharacters,
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
				this.model.hoveringBattleCharacterTile,
				() => this.model.hoveringBattleCharacterTile.get() || this.game.isInDebugMode.get(),
				() => new BattleRingRenderer(
					this.game,
					this.model.mouseHoveringTile,
					this.drawForeground
				)
			)
		);

		this.addAutoEvent(
			this.game.mainLayerSize,
			'change',
			() => {
				this.updateCanvasSize();
				this.updateRendererSize();
				this.updateSvgSize();
			},
			true
		);

		this.addAutoEvent(
			this.game.isInDebugMode,
			'change',
			() => {
				this.model.hoveringBattleCharacterTile.triggerEvent('change');
			}
		);

		this.addAutoEvent(
			this.model.mouseCoordinates,
			'change',
			() => this.raycast()
		);
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
		this.directLight.position.set( 0, 10, -10 );
		this.directLight.castShadow = false;
		if (this.directLight.castShadow) {
			this.directLight.shadow.bias = 0;
			this.directLight.shadow.camera.near = 0.5;
			this.directLight.shadow.camera.far = 25;
			this.directLight.shadow.camera.right = 15;
			this.directLight.shadow.camera.left = -15;
			this.directLight.shadow.camera.top = 15;
			this.directLight.shadow.camera.bottom = -15;
			this.directLight.shadow.mapSize.width = 1024;
			this.directLight.shadow.mapSize.height = 1024;

			const shadowMaterial = new THREE.ShadowMaterial({color:'#000000'})
			shadowMaterial.opacity = 0.5;
			shadowMaterial.side = THREE.FrontSide;
			shadowMaterial.shadowSide = THREE.FrontSide;
			this.floor = new THREE.Mesh(new THREE.PlaneGeometry(135, 135), shadowMaterial);
			this.floor.receiveShadow = true;
			this.floor.position.set(0, 0, 0);
			this.floor.rotation.set(-Math.PI / 2, 0, 0);
			this.scene.add(this.floor);
		}
		this.scene.add(this.directLight);

		this.composer = new EffectComposer(this.renderer);

		const renderPass = new RenderPass(this.scene, this.camera);
		this.composer.addPass(renderPass);

		this.effectFXAA = new ShaderPass(FXAAShader);
		this.effectFXAA.uniforms['resolution'].value.set(1 / this.game.mainLayerSize.x, 1 / this.game.mainLayerSize.y);
		this.composer.addPass(this.effectFXAA);

		this.updateCameraPosition();

		this.composer.render();

		this.game.assets.getAsset(
			this.model.battleMap.get().backgroundImage.get(),
			(img) => {
				this.bgImage = img;
				this.renderBgImage();
			}
		);

		this.game.triggerEvent('battle-resize');
	}

	deactivateInternal() {
		if (this.gui) {
			this.gui.destroy();
		}
		this.ambientLight.dispose();
		this.directLight.dispose();
		if (this.floor) {
			this.floor.material.dispose();
			this.floor.geometry.dispose();
		}
		this.renderer.dispose();
		Pixies.destroyElement(this.bgCanvas);
		this.draw.remove();
		Pixies.destroyElement(this.draw);
		Pixies.destroyElement(this.container);
		const save = this.game.saveGame.get();
		save.triggerEvent('trigger-resize');
	}

	renderInternal() {
		if (this.model.zoom.isDirty) {
			this.updateCameraZoom();
		}
		if (this.model.coordinates.isDirty) {
			this.updateCameraPosition();
		}
		if (this.model.coordinates.isDirty || this.model.zoom.isDirty) {
			this.renderBgImage();
			this.updateSvgViewBox();
		}
		if (this.model.cursorType.isDirty) {
			CURSOR_TYPES.forEach((type) => Pixies.removeClass(this.container, `cursor-${type}`));
			if (this.model.cursorType.isSet()) {
				Pixies.addClass(this.container, `cursor-${this.model.cursorType.get()}`);
			}
		}
		this.composer.render();
	}

	raycast() {
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		mouse.x = (this.game.mainLayerMouseCoordinates.x / this.game.mainLayerSize.x) * 2 - 1;
		mouse.y = -(this.game.mainLayerMouseCoordinates.y / this.game.mainLayerSize.y) * 2 + 1;

		raycaster.setFromCamera(mouse, this.camera);
		const intersects = raycaster.intersectObject(this.scene, true);

		if (intersects.length > 0) {
			let battleCharacter = null;
			for (let i = 0, max = intersects.length; i < max && battleCharacter === null; i++) {
				battleCharacter = this.findParentCharacter(intersects[i].object);
			}
			this.model.triggerEvent('raycast-character', battleCharacter);
		} else {
			this.model.triggerEvent('raycast-character', null);
		}
	}

	findParentCharacter(mesh) {
		if (typeof mesh.userData === 'object' && mesh.userData.battleCharacter) {
			return mesh.userData.battleCharacter;
		}
		if (mesh.parent) {
			return this.findParentCharacter(mesh.parent);
		}
		return null;
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
			this.model.cornerCoordinates.x,
			this.model.cornerCoordinates.y,
			this.game.mainLayerSize.x / this.model.zoom.get(),
			this.game.mainLayerSize.y / this.model.zoom.get(),
			0,
			0,
			this.game.mainLayerSize.x,
			this.game.mainLayerSize.y
		);
	}

	updateCanvasSize() {
		this.bgCanvas.width = this.game.mainLayerSize.x;
		this.bgCanvas.height = this.game.mainLayerSize.y;
		this.renderBgImage();
	}

	updateRendererSize() {
		this.renderer.setSize(this.game.mainLayerSize.x, this.game.mainLayerSize.y);
		this.composer.setSize(this.game.mainLayerSize.x, this.game.mainLayerSize.y);

		const pixelRatio = this.renderer.getPixelRatio();
		this.effectFXAA.material.uniforms['resolution'].value.x = 1 / (this.game.mainLayerSize.x * pixelRatio);
		this.effectFXAA.material.uniforms['resolution'].value.y = 1 / (this.game.mainLayerSize.y * pixelRatio);

		const pxPerUnit = this.model.battleMap.get().tileSize.get();
		const horizontal = (this.game.mainLayerSize.x / 2) / pxPerUnit;
		const vertical = (this.game.mainLayerSize.y / 2) / pxPerUnit;
		this.camera.left = - horizontal;
		this.camera.right = horizontal;
		this.camera.bottom = - vertical;
		this.camera.top = vertical;
		this.updateCameraZoom();
		this.composer.render();
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
		this.updateSvgViewBox();
	}

	updateSvgViewBox() {
		this.draw.viewbox(
			this.model.cornerCoordinates.x,
			this.model.cornerCoordinates.y,
			this.game.mainLayerSize.x / this.model.zoom.get(),
			this.game.mainLayerSize.y / this.model.zoom.get(),
		);
	}

}
