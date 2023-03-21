import ControllerNode from "../../basic/ControllerNode";
import ItemModel from "../../../model/game/items/ItemModel";
import ItemSlotModel from "../../../model/game/items/ItemSlotModel";

export default class BattleItemSlotController extends ControllerNode {

	/**
	 * @type ItemSlotModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.item,
			'change',
			() => {
				this.model.additionalItemsSlots.reset();
				if (this.model.item.isEmpty()) {
					return;
				}
				const itemDef = this.game.resources.itemDefinitions.getById(this.model.item.get().definitionId.get());
				if (!itemDef) {
					return;
				}
				itemDef.additionalItems.forEach(
					(ai) => {
						const item = new ItemModel();
						item.definitionId.set(ai.definitionId.get());
						const slot = new ItemSlotModel(['all'], ai.slotName.get());
						slot.item.set(item);
						this.model.additionalItemsSlots.add(slot);
					}
				);
			},
			true
		);
	}

}
