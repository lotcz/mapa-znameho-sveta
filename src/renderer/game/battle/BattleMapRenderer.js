import ConditionalNodeRenderer from "../../basic/ConditionalNodeRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";
import BattleSpecialRenderer from "./BattleSpecialRenderer";
import RendererNode from "../../basic/RendererNode";
import BattleSpriteRenderer from "./BattleSpriteRenderer";
import BattleSprite3dRenderer from "./BattleSprite3dRenderer";

export default class BattleMapRenderer extends RendererNode {

	/**
	 * @type BattleMapModel
	 */
	model;

	constructor(game, model, scene, draw) {
		super(game, model);

		this.model = model;
		this.scene = scene;
		this.draw = draw;

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.sprites,
				(m) => new BattleSpriteRenderer(this.game, m, this.scene)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.sprites3d,
				(m) => new BattleSprite3dRenderer(this.game, m, this.scene)
			)
		);

		const specialsRenderer = this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.game.editor.battleEditor.showHelpers,
				() => this.game.isInDebugMode.get() && this.game.editor.battleEditor.showHelpers.get(),
				() => {
					return new CollectionRenderer(
						this.game,
						this.model.specials,
						(m) => new BattleSpecialRenderer(this.game, m, this.draw)
					)
				}
			)
		);
		this.addAutoEvent(this.game.isInDebugMode, 'change', () => specialsRenderer.updateRenderer(), false);

	}

}
