import ModelNode from "../basic/ModelNode";
import FloatValue from "../basic/FloatValue";
import BoolValue from "../basic/BoolValue";
import ModelNodeCollection from "../basic/ModelNodeCollection";
import AudioModel from "./AudioModel";

export default class GlobalAudioModel extends ModelNode {

	/**
	 * @type BoolValue
	 */
	audioOn;

	/**
	 * @type FloatValue
	 */
	masterVolume;

	/**
	 * @type BoolValue
	 */
	musicOn;

	/**
	 * @type BoolValue
	 */
	paused;

	/**
	 * @type FloatValue
	 */
	musicVolume;

	/**
	 * @type BoolValue
	 */
	soundsOn;

	/**
	 * @type FloatValue
	 */
	soundsVolume;

	/**
	 * @type ModelNodeCollection<AudioModel>
	 */
	music;

	/**
	 * @type ModelNodeCollection<AudioModel>
	 */
	sounds;

	constructor(persistent = true) {
		super(persistent);

		this.audioOn = this.addProperty('audioOn', new BoolValue(true));
		this.masterVolume = this.addProperty('masterVolume', new FloatValue(1));
		this.paused = this.addProperty('paused', new BoolValue(false));

		this.musicOn = this.addProperty('musicOn', new BoolValue(true));
		this.musicVolume = this.addProperty('musicVolume', new FloatValue(1));

		this.soundsOn = this.addProperty('soundsOn', new BoolValue(true));
		this.soundsVolume = this.addProperty('soundsVolume', new FloatValue(1));

		this.music = this.addProperty('music', new ModelNodeCollection(null, false));
		this.sounds = this.addProperty('sounds', new ModelNodeCollection(null, false));
	}

	playSound(url, loop = false) {
		const sound = new AudioModel();
		sound.url.set(url);
		sound.loop.set(loop);
		sound.playing.set(true);
		this.sounds.add(sound);
		return sound;
	}

	removeSound(audio) {
		this.sounds.remove(audio);
	}
}
