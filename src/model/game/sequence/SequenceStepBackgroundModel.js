import FloatValue from "../../basic/FloatValue";
import Vector2 from "../../basic/Vector2";
import StringValue from "../../basic/StringValue";
import ImageModel from "../../basic/ImageModel";
import SequenceStepBaseModel from "./SequenceStepBaseModel";
import IntValue from "../../basic/IntValue";

export default class SequenceStepBackgroundModel extends SequenceStepBaseModel {

	/**
	 * @type IntValue
	 */
	fadeInDuration;

	/**
	 * @type IntValue
	 */
	fadeOutDuration;

	/**
	 * @type Vector2
	 */
	startCoordinates;

	/**
	 * @type Vector2
	 */
	endCoordinates;

	/**
	 * @type FloatValue
	 */
	startZoom;

	/**
	 * @type FloatValue
	 */
	endZoom;

	/**
	 * @type StringValue
	 */
	image;

	/**
	 * @type ImageModel
	 */
	renderingImage;

	constructor() {
		super();

		this.fadeInDuration = this.addProperty('fadeInDuration', new IntValue(2000));
		this.fadeOutDuration = this.addProperty('fadeOutDuration', new IntValue(2000));
		this.image = this.addProperty('image', new StringValue());
		this.startCoordinates = this.addProperty('startCoordinates', new Vector2());
		this.endCoordinates = this.addProperty('endCoordinates', new Vector2());
		this.startZoom = this.addProperty('startZoom', new FloatValue(0));
		this.endZoom = this.addProperty('endZoom', new FloatValue(0));


		this.renderingImage = this.addProperty('renderingImage', new ImageModel(false));
	}

	setStart() {
		this.startCoordinates.set(this.renderingImage.coordinates);
		this.startZoom.set(this.renderingImage.zoom.get());
	}

	setEnd() {
		this.endCoordinates.set(this.renderingImage.coordinates);
		this.endZoom.set(this.renderingImage.zoom.get());
	}

}
