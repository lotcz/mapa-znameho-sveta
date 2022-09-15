import ControllerNode from "../../basic/ControllerNode";
import ItemModel from "../../../model/game/items/ItemModel";
import InventorySlotModel from "../../../model/game/party/characters/InventorySlotModel";

export default class BattleItemSlotController extends ControllerNode {

	/**
	 * @type InventorySlotModel
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
						console.log(ai, 'addi');
						const item = new ItemModel();
						item.definitionId.set(ai.definitionId.get());
						const slot = new InventorySlotModel(['all'], ai.slotName.get());
						slot.item.set(item);
						this.model.additionalItemsSlots.add(slot);
					}
				);
			},
			true
		);
	}

}
