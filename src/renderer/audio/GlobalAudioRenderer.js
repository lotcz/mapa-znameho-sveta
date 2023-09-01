import CollectionRenderer from "../basic/CollectionRenderer";
import AudioRenderer from "./AudioRenderer";
import RendererNode from "../basic/RendererNode";
import ConditionalNodeRenderer from "../basic/ConditionalNodeRenderer";

export default class GlobalAudioRenderer extends RendererNode {

	/**
	 * @type GlobalAudioModel
	 */
	model;

	/**
	 * @type AudioContext
	 */
	audioContext;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.musicOn,
				() => this.model.musicOn.get(),
				() => {
					return new CollectionRenderer(
						this.game,
						this.model.music,
						(m) => new AudioRenderer(this.game, m, this.audioContext, this.musicGainNode)
					)
				}
			)
		);

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.soundsOn,
				() => this.model.soundsOn.get(),
				() => {
					return new CollectionRenderer(
						this.game,
						this.model.sounds,
						(m) => new AudioRenderer(this.game, m, this.audioContext, this.soundsGainNode)
					)
				}
			)
		);
	}

	activateInternal() {
		this.audioContext = new AudioContext();

		this.masterGainNode = this.audioContext.createGain();
		this.musicGainNode = this.audioContext.createGain();
		this.soundsGainNode = this.audioContext.createGain();

		this.musicGainNode.connect(this.masterGainNode);
		this.soundsGainNode.connect(this.masterGainNode);
		this.masterGainNode.connect(this.audioContext.destination);

		this.updateMasterVolume();
		this.updateSoundsVolume();
		this.updateMusicVolume();
	}

	deactivateInternal() {

		this.masterGainNode.disconnect();
		this.soundsGainNode.disconnect();
		this.musicGainNode.disconnect();

		this.masterGainNode = null;
		this.soundsGainNode = null;
		this.musicGainNode = null;
		this.audioContext = null;
	}

	renderInternal() {
		if (this.audioContext.state === "suspended") {
			this.audioContext.resume();
		}
		if (this.model.masterVolume.isDirty) {
			this.updateMasterVolume();
		}
		if (this.model.musicVolume.isDirty) {
			this.updateMusicVolume();
		}
		if (this.model.soundsVolume.isDirty) {
			this.updateSoundsVolume();
		}
	}

	updateMasterVolume() {
		this.masterGainNode.gain.value = this.model.masterVolume.get();
	}

	updateMusicVolume() {
		this.musicGainNode.gain.value = this.model.musicVolume.get();
	}

	updateSoundsVolume() {
		this.soundsGainNode.gain.value = this.model.soundsVolume.get();
	}
}
