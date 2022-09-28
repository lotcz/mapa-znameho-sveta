import DirtyValue from "../../../basic/DirtyValue";
import Vector2 from "../../../basic/Vector2";
import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";
import IntValue from "../../../basic/IntValue";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";
import BattleSpriteModel from "./BattleSpriteModel";
import BattleSpecialModel, {SPECIAL_TYPE_BLOCK} from "./BattleSpecialModel";
import BattleSprite3dModel from "./BattleSprite3dModel";

export default class BattleMapModel extends IdentifiedModelNode {

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
	 * @type IntValue
	 * size of one battle tile in pixels, as it would be in background image when scale is 1 and not in isometric view
	 */
	tileSize;

	/**
	 * @type Vector2
	 */
	start;

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

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Battle Map ${id}`));
		this.backgroundImage = this.addProperty('backgroundImage', new DirtyValue('img/camp.jpg'));
		this.tileSize = this.addProperty('tileSize', new IntValue(70/*62.77*/));

		this.start = this.addProperty('start', new Vector2(-102, -25));

		this.sprites = this.addProperty('sprites', new ModelNodeCollection(() => new BattleSpriteModel()));
		this.blocksSpritesCache = null;
		this.sprites.addOnAddListener(() => this.blocksSpritesCache = null);
		this.sprites.addOnRemoveListener(() => this.blocksSpritesCache = null);

		this.sprites3d = this.addProperty('sprites3d', new ModelNodeCollection(() => new BattleSprite3dModel()));
		this.blocksSprites3dCache = null;
		this.sprites3d.addOnAddListener(() => this.blocksSprites3dCache = null);
		this.sprites3d.addOnRemoveListener(() => this.blocksSprites3dCache = null);

		this.specials = this.addProperty('specials', new ModelNodeCollection(() => new BattleSpecialModel()));
		this.blocksSpecialsCache = null;
		this.specials.addOnAddListener(() => this.blocksSpecialsCache = null);
		this.specials.addOnRemoveListener(() => this.blocksSpecialsCache = null);
	}

	/**
	 * @param {Vector2} coords
	 * @returns {Vector2}
	 */
	screenCoordsToPosition(coords) {
		const w = this.tileSize.get();
		const tileWidthHalf = 0.815 * 0.5 * Math.sqrt(3) * w;
		const tileHeightHalf = 0.815 * 0.5 * w;

		const position = new Vector2();
		position.x = 0.5 * ((-coords.x / tileWidthHalf) + (-coords.y / tileHeightHalf));
		position.y = 0.5 * ((coords.x / tileWidthHalf) + (-coords.y / tileHeightHalf));
		return position;
	}

	/**
	 * @param {Vector2} position
	 * @returns {Vector2}
	 */
	positionToScreenCoords(position) {
		const w = this.tileSize.get();
		const tileWidthHalf = 0.815 * 0.5 * Math.sqrt(3) * w;
		const tileHeightHalf = 0.815 * 0.5 * w;

		const coords = new Vector2();
		coords.x = (position.y - position.x) * tileWidthHalf;
		coords.y = (-position.y - position.x) * tileHeightHalf;
		return coords;
	}

	/**
	 * @param {Vector2} coords
	 * @returns {Vector2}
	 */
	screenCoordsToTile(coords) {
		const position = this.screenCoordsToPosition(coords);
		return position.round();
	}

	getBlocks() {
		const sprites = this.getBlocksSprites();
		const sprites3d = this.getBlocksSprites3d();
		const specials = this.getBlocksSpecials();
		return sprites.concat(sprites3d).concat(specials);
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
