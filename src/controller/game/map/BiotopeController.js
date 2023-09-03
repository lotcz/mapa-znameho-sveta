import ControllerNode from "../../basic/ControllerNode";
import AudioModel from "../../../model/audio/AudioModel";

export default class BiotopeController extends ControllerNode {

	/**
	 * @type BiotopeModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(this.model.musicUrlNormal, 'change', (param) => this.updateMusic(param), true);
	}

	updateMusic() {
		console.log('activated', this.model.musicUrlNormal.get());
		if (this.model.musicUrlNormal.isEmpty()) return;
		const music = new AudioModel(false);
		music.url.set(this.model.musicUrlNormal.get());
		music.loop.set(true);
		this.game.audio.changeMusic(music);
	}

}
