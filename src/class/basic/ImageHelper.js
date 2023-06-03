import Vector2 from "../../model/basic/Vector2";
import Pixies from "./Pixies";

export class ImageHelper {

	/**
	 *
	 * @param size
	 * @param viewBoxSize
	 * @param {Number} zoom
	 * @param max
	 * @returns {number}
	 */
	static sanitizeZoom(size, viewBoxSize, zoom = 0.0, max = Number.MAX_VALUE) {
		if (zoom > max) {
			return max;
		}

		if (size.x === 0 || size.y === 0) return 1;

		const minZoomX = viewBoxSize.x / size.x;
		const minZoomY = viewBoxSize.y / size.y;

		return Pixies.between(Math.max(minZoomX, minZoomY), max, zoom);
	}

	static sanitizeCenter(size, viewBoxSize, zoom, coordinates) {
		const result = new Vector2(coordinates);
		const vbs = viewBoxSize.multiply((1 / zoom) * 0.5);
		result.x = (result.x < vbs.x) ? vbs.x : result.x;
		result.x = (result.x > (size.x - vbs.x)) ? (size.x - vbs.x) : result.x;
		result.y = (result.y < vbs.y) ? vbs.y : result.y;
		result.y = (result.y > (size.y - vbs.y)) ? (size.y - vbs.y) : result.y;
		return result;
	}

}

