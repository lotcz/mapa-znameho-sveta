import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventoryTabQuestsRenderer extends DomRenderer {

	/**
	 * @type CompletedQuestsModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addAutoEvent(
			this.model,
			'quest-completed',
			() => this.renderQuests(),
			true
		);
	}

	activateInternal() {
		this.container = this.addElement( 'div', 'inventory-quests column flex-1 p-1 m-1');
		Pixies.createElement(this.container, 'h2', null, 'Úkoly');
		this.quests = Pixies.createElement(this.container, 'div');
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
	}

	renderQuests() {
		Pixies.emptyElement(this.quests);
		const activeGroup = Pixies.createElement(this.quests, 'div');
		const completedGroup = Pixies.createElement(this.quests, 'div', 'completed');

		const completedQuests = [];

		this.model.forEach((id) => {
			const quest = this.game.resources.quests.getById(id);
			if (quest && quest.isQuest()) {
				const [stage, completed] = this.getQuestActiveStage(quest);

				if (completed) {
					completedQuests.push({quest, stage});
				} else {
					this.renderQuest(activeGroup, quest, stage);
				}
			}
		});

		if (completedQuests.length > 0) {
			Pixies.createElement(completedGroup, 'h2', null, 'Dokončené');
		}

		completedQuests.forEach((q) => {
			this.renderQuest(completedGroup, q.quest, q.stage);
		});

	}

	renderQuest(container, quest, stage) {
		const title = Pixies.createElement(container, 'h3', null, quest.name.get());
		const text =  Pixies.createElement(container, 'p', null, stage.text.get());
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
