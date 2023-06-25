import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";

/**
 * Used for preloading portraits
 */
export default class ConversationPortraitLoader extends AssetLoader {

	loadInternal() {
		const conversationId = Pixies.extractId(this.uri);

		const conversation = this.assets.resources.conversations.getById(conversationId);
		if (!conversation) {
			this.fail(`Conversation ${conversationId} not found!`);
		}

		this.assets.getAsset(
			conversation.portrait.get(),
			(img) => {
				this.finish(img);
			}
		);

	}

}
