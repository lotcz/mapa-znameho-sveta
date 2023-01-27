import RendererNode from "../basic/RendererNode";

const HAVE_ENOUGH_DATA = 4;

export default class AudioRenderer extends RendererNode {

	/**
	 * @type AudioModel
	 */
	model;

	audio;
	audioContext;
	destination;
	source;

	constructor(game, model, audioContext, destination) {
		super(game, model);

		this.model = model;
		this.audioContext = audioContext;
		this.destination = destination;

		this.addAutoEvent(
			this.game.audio.paused,
			'change',
			() => this.updatePlaying()
		);
	}

	activateInternal() {
		this.audio = new Audio();
		this.source = this.audioContext.createMediaElementSource(this.audio);
		this.source.connect(this.destination);
		this.updateAudio();

		this.audio.addEventListener('ended', () => {
			if (!this.model.loop.get()) {
				this.model.triggerEvent('remove-me', this.model);
			}
		});

		this.game.assets.getAsset(this.model.url.get(), (audio) => {
			if (!this.audio) {
				console.log('audio loaded after renderer was deactivated');
				return;
			}

			this.audio.addEventListener('canplaythrough', () => {
				this.updatePlaying();
			});

			this.audio.src = audio.src;
		});
	}

	deactivateInternal() {
		this.pause();
		this.source.disconnect();
		this.source = null;
		this.audio = null;
	}

	renderInternal() {
		if (this.model.loop.isDirty) {
			this.updateLoop();
		}
		if (this.model.volume.isDirty) {
			this.updateVolume();
		}
		if (this.model.playing.isDirty) {
			this.updatePlaying();
		}
	}

	updateAudio() {
		this.audio.autoplay = false;
		this.audio.muted = false;
		this.audio.controls = false;
		this.updateLoop();
		this.updateVolume();
		this.updatePlaying();
	}

	updatePlaying() {
		if (this.model.playing.get() && !this.game.audio.paused.get()) {
			this.play();
		} else {
			this.pause();
		}
	}

	updateLoop() {
		this.audio.loop = this.model.loop.get();
	}

	updateVolume() {
		this.audio.volume = this.model.volume.get();
	}

	rewind(time = 0) {
		this.audio.currentTime = time;
	}

	replay() {
		this.rewind();
		this.play();
	}

	play() {
		if (this.audio.readyState === HAVE_ENOUGH_DATA) {
			this.audio.play();
		}
	}

	pause() {
		this.audio.pause();
	}

}
