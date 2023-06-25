import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";

/**
 * Used for preloading portraits
 */
export default class CharacterPortraitLoader extends AssetLoader {

	loadInternal() {
		const characterTemplateId = Pixies.extractId(this.uri);

		const character = this.assets.resources.characterTemplates.getById(characterTemplateId);
		if (!character) {
			this.fail(`Character template ${characterTemplateId} not found!`);
		}

		this.assets.getAsset(
			character.portrait.get(),
			(img) => {
				this.finish(img);
			}
		);

	}

}
