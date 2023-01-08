import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventoryTabQuestsRenderer extends DomRenderer {

	/**
	 * @type CompletedStagesModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement( 'div', 'inventory-quests column flex-1 p-1 m-1');
		Pixies.createElement(this.container, 'h2', null, 'Úkoly');
		this.quests = Pixies.createElement(this.container, 'div');
		this.renderQuests();
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
	}

	renderQuests() {
		this.model.forEach((id) => {
			const quest = this.game.resources.quests.getById(id);
			if (quest.isQuest()) {
				const [stage, completed] = this.getQuestActiveStage(quest);

				const title = Pixies.createElement(this.quests, 'h2', null, quest.name.get());
				const text =  Pixies.createElement(this.quests, 'p', null, stage.text.get());

			}
		});


	}

	getQuestActiveStage(quest) {
		const children = this.game.resources.quests.filter((stage) => stage.parentStageId.equalsTo(quest.id.get()));
		if (children.length === 0) {
			return [quest, true];
		}
		const completed = children.find((stage) => this.model.isCompleted(stage.id.get()));
		if (!completed) {
			return [quest, false];
		}
		return this.getQuestActiveStage(completed);
	}

}
