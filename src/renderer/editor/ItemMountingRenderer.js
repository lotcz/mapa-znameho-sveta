import Pixies from "../../class/basic/Pixies";
import GUIHelper from "../../class/basic/GUIHelper";
import DomRenderer from "../basic/DomRenderer";
import Vector2 from "../../model/basic/Vector2";

const PREVIEW_SIZE = new Vector2(250, 250);

export default class ItemMountingRenderer extends DomRenderer {

	/**
	 * @type ItemDefinitionModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
		this.scene = null;
		this.battleCharacter = null;
		this.battleCharacterRenderer = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'bg item-def');
		this.buttons = Pixies.createElement(this.container,'div', 'buttons');
		this.close = Pixies.createElement(this.buttons, 'button', null, 'Close', () => this.game.editor.activeItemMounting.set(null));

		this.slot = Pixies.createElement(this.container, 'div', 'slot');

		this.gui = GUIHelper.createGUI();
		const position = GUIHelper.addVector3(this.gui, this.model.mountingPosition, 'mounting position', -30, 30, 0.1);
		position.open();
		const quaternion = GUIHelper.addRotationVector3(this.gui, this.model.mountingRotation, 'mounting rotation');
		quaternion.open();
		const position2 = GUIHelper.addVector3(this.gui, this.model.altMountingPosition, 'alt mounting position', -30, 30, 0.1);
		position2.open();
		const quaternion2 = GUIHelper.addRotationVector3(this.gui, this.model.altMountingRotation, 'alt mounting rotation');
		quaternion2.open();
/*
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.slot.appendChild(this.renderer.domElement);
		this.renderer.setSize(PREVIEW_SIZE.x, PREVIEW_SIZE.y);
		this.scene = new THREE.Scene();

		this.camera = new THREE.OrthographicCamera(-50,50, 50, -50);
		const horizontal = 2;
		const vertical = 2;
		this.camera.left = - horizontal;
		this.camera.right = horizontal;
		this.camera.bottom = - vertical;
		this.camera.top = vertical;
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

		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		this.orbitControls.update();

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

		this.battleCharacter = new BattleCharacterModel();
		const characterTemp = this.game.resources.characterTemplates.getById(1);
		const character = new CharacterModel();
		character.restoreState(characterTemp.getState());
		this.battleCharacter.character.set(character);
		this.battleCharacter.rotation.set(-Math.PI);

		const item = new ItemModel();
		item.definitionId.set(this.model.id.get());

		let placeInHands = true;

		if (this.model.type.equalsTo('head')) {
			character.inventory.head.item.set(item);
		}

		if (this.model.type.equalsTo('clothing')) {
			character.inventory.clothing.item.set(item);
			placeInHands = false;
		}

		if (this.model.type.equalsTo('legs')) {
			const ai = new AdditionalItemModel();
			ai.definitionId.set(item.definitionId.get());
			ai.slotName.set('leftLeg');
			character.additionalItems.add(ai);
			const ai2 = new AdditionalItemModel();
			ai2.definitionId.set(item.definitionId.get());
			ai2.slotName.set('rightLeg');
			character.additionalItems.add(ai2);
			placeInHands = false;
		}

		if (placeInHands) {
			character.inventory.leftHand.item.set(item);
			character.inventory.rightHand.item.set(item);
		}

		this.battleCharacterRenderer = new BattleCharacterRenderer(this.game, this.battleCharacter, this.scene);
		this.battleCharacterRenderer.activate();

		this.updatePreview();

 */
	}

	deactivateInternal() {
		/*
		this.ambientLight.dispose();
		this.ambientLight = null;
		this.directLight.dispose();
		this.directLight = null;
		this.scene = null;
		this.renderer.dispose();
		this.renderer = false;
		 */
		this.removeElement(this.container);
		this.gui.destroy();
		this.gui = null;
	}

	renderInternal() {
		//this.updatePreview();
	}

	updatePreview() {
		this.orbitControls.update();
		//this.battleCharacter.position.makeDirty();
		//this.battleCharacter.rotation.makeDirty();
		//this.battleCharacterRenderer.render();
		this.composer.render();
	}

}
