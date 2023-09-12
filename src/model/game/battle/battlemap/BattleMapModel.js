import DirtyValue from "../../../basic/DirtyValue";
import Vector2 from "../../../basic/Vector2";
import IntValue from "../../../basic/IntValue";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";
import BattleSpriteModel from "./BattleSpriteModel";
import BattleSpecialModel, {SPECIAL_TYPE_BLOCK} from "./BattleSpecialModel";
import BattleSprite3dModel from "./BattleSprite3dModel";
import BattleNpcSpawnModel from "./BattleNpcSpawnModel";
import IdentifiedModelNodeWithResources from "../../../basic/IdentifiedModelNodeWithResources";
import FloatValue from "../../../basic/FloatValue";

export default class BattleMapModel extends IdentifiedModelNodeWithResources {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 * path to image asset
	 */
	backgroundImage;

	/**
	 * @type Vector2
	 * size of bg image in pixels
	 */
	size;

	/**
	 * @type IntValue
	 * size of one battle tile in pixels, as it would be in background image when scale is 1 and not in isometric view
	 */
	tileSize;

	/**
	 * @type ModelNodeCollection<BattleSpriteModel>
	 */
	sprites;

	/**
	 * @type ModelNodeCollection<BattleSprite3dModel>
	 */
	sprites3d;

	/**
	 * @type ModelNodeCollection<BattleSpecialModel>
	 */
	specials;

	/**
	 * @type ModelNodeCollection<BattleNpcSpawnModel>
	 */
	npcSpawns;

	/**
	 * @type FloatValue
	 */
	minZoom;

	/**
	 * @type FloatValue
	 */
	maxZoom;

	/**
	 * @type FloatValue
	 */
	defaultZoom;

	constructor(resources, id) {
		super(resources, id);

		this.name = this.addProperty('name', new DirtyValue(`Battle Map ${id}`));
		this.backgroundImage = this.addProperty('backgroundImage', new DirtyValue('img/camp.jpg'));

		this.tileWidthHalf = 1;
		this.tileHeightHalf = 1;

		this.tileSize = this.addProperty('tileSize', new IntValue());
		this.tileSize.addOnChangeListener(() => {
			const w = this.tileSize.get();
			this.tileWidthHalf = 0.815 * 0.5 * Math.sqrt(3) * w;
			this.tileHeightHalf = 0.815 * 0.5 * w;
		});

		this.size = this.addProperty('size', new Vector2());

		this.blocksCache = null;
		this.sprites = this.addProperty('sprites', new ModelNodeCollection(() => new BattleSpriteModel(this.resources)));
		this.blocksSpritesCache = null;
		this.sprites.addEventListener(
			'change',
			() => {
				this.blocksCache = this.blocksSpritesCache = null;
				this.triggerEvent('blocks-changed');
			}
		);

		this.sprites3d = this.addProperty('sprites3d', new ModelNodeCollection(() => new BattleSprite3dModel()));
		this.blocksSprites3dCache = null;
		this.sprites3d.addEventListener(
			'change',
			() => {
				this.blocksCache = this.blocksSprites3dCache = null;
				this.triggerEvent('blocks-changed');
			}
		);

		this.specials = this.addProperty('specials', new ModelNodeCollection(() => new BattleSpecialModel()));
		this.blocksSpecialsCache = null;
		this.specials.addEventListener(
			'change',
			() => {
				this.blocksCache = this.blocksSpecialsCache = null;
				this.triggerEvent('blocks-changed');
			}
		);

		this.npcSpawns = this.addProperty('npcSpawns', new ModelNodeCollection(() => new BattleNpcSpawnModel()));

		this.minZoom = this.addProperty('minZoom', new FloatValue(0));
		this.maxZoom = this.addProperty('maxZoom', new FloatValue(Number.MAX_VALUE));
		this.defaultZoom = this.addProperty('defaultZoom', new FloatValue(1));
	}

	/**
	 * @param {Vector2} coords
	 * @returns {Vector2}
	 */
	screenCoordsToPosition(coords) {
		const position = new Vector2();
		position.x = 0.5 * ((-coords.x / this.tileWidthHalf) + (-coords.y / this.tileHeightHalf));
		position.y = 0.5 * ((coords.x / this.tileWidthHalf) + (-coords.y / this.tileHeightHalf));
		return position;
	}

	/**
	 * @param {Vector2} position
	 * @returns {Vector2}
	 */
	positionToScreenCoords(position) {
		const coords = new Vector2();
		coords.x = (position.y - position.x) * this.tileWidthHalf;
		coords.y = (-position.y - position.x) * this.tileHeightHalf;
		return coords;
	}

	/**
	 * @param {Vector2} coords
	 * @returns {Vector2}
	 */
	screenCoordsToTile(coords) {
		return this.screenCoordsToPosition(coords).round();
	}

	getBlocks() {
		if (!this.blocksCache) {
			const sprites = this.getBlocksSprites();
			const sprites3d = this.getBlocksSprites3d();
			const specials = this.getBlocksSpecials();
			this.blocksCache = sprites.concat(sprites3d).concat(specials);
		}
		return this.blocksCache;
	}

	getBlocksSprites() {
		if (this.blocksSpritesCache === null) {
			this.blocksSpritesCache = this.sprites.reduce(
				(prev, current) => {
					const sprite = current.sprite.get();
					if (sprite) {
						const spriteBlocks = sprite.blocks.map((b) => b.position.add(current.position));
						return prev.concat(spriteBlocks);
					}
					return prev;
				},
				[]
			);
		}
		return this.blocksSpritesCache;
	}

	getBlocksSprites3d() {
		if (this.blocksSprites3dCache === null) {
			this.blocksSprites3dCache = this.sprites3d.reduce(
				(prev, current) => {
					const sprite = current.sprite.get();
					if (sprite) {
						const spriteBlocks = sprite.blocks.map((b) => b.position.add(current.position));
						return prev.concat(spriteBlocks);
					}
					return prev;
				},
				[]
			);
		}
		return this.blocksSprites3dCache;
	}

	getBlocksSpecials() {
		if (this.blocksSpecialsCache === null) {
			this.blocksSpecialsCache = this.specials.filter((s) => s.type.equalsTo(SPECIAL_TYPE_BLOCK)).map((s => s.position));
		}
		return this.blocksSpecialsCache;
	}
}
