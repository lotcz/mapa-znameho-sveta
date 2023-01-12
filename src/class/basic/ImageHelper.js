import Vector2 from "../../model/basic/Vector2";
import Pixies from "./Pixies";

export class ImageHelper {

	static sanitizeCenter(size, viewBoxSize, zoom, coordinates) {
		const result = new Vector2(coordinates);
		const vbs = viewBoxSize.multiply((1 / zoom) * 0.5);
		result.x = (result.x < vbs.x) ? vbs.x : result.x;
		result.x = (result.x > (size.x - vbs.x)) ? (size.x - vbs.x) : result.x;
		result.y = (result.y < vbs.y) ? vbs.y : result.y;
		result.y = (result.y > (size.y - vbs.y)) ? (size.y - vbs.y) : result.y;
		return result;
	}

	static sanitizeZoom(size, viewBoxSize, zoom, max) {
		if (zoom > max) {
			return max;
		}

		const minZoomX = viewBoxSize.x / size.x;
		const minZoomY = viewBoxSize.y / size.y;

		return Pixies.between(Math.max(minZoomX, minZoomY), max, zoom);
	}

}

