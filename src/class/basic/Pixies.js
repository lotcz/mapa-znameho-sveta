export default class Pixies {

	static round(number, decimals) {
		const d = Math.pow(10, decimals);
		return Math.round(number * d) / d;
	}

	static shorten(text, length = 25, ellipsis = '...') {
		if (text === null || text === undefined || typeof text !== 'string') {
			return text;
		}
		if (text.length <= length) {
			return text;
		}
		let short = text.substring(0, length - ellipsis.length);
		short += ellipsis;
		return short;
	}

	static extractId(str, pos = 1) {
		const words = str.split('/');
		if (words.length > pos) return words[pos];
		return null;
	}

	static random(min, max) {
		const diff = max - min;
		return min + (diff * Math.random());
	}

	static arrayRemove(arr, el) {
		arr.splice(arr.indexOf(el), 1);
	}

	static randomElement(arr) {
		return arr[Pixies.randomIndex(arr.length)];
	}

	static randomIndex(length) {
		return Math.floor(Math.random() * length);
	}

	/**
		Returns n if n is between min and max. Return min if n lower than min or return max if n is greater than max.
	 */
	static between(min, max, n) {
		const minimum = Math.min(min, max);
		const maximum = Math.max(min, max);
		return Math.min(maximum, Math.max(minimum, n));
	}

	static isBetween(n, min, max) {
		const minimum = Math.min(min, max);
		const maximum = Math.max(min, max);
		return n >= minimum && n <= maximum;
	}

	static hash(value) {
		let hash = 0;
		if (value.length === 0) return hash;
		for (let i = 0 ; i < value.length ; i++)
		{
			let ch = value.charCodeAt(i);
			hash = ((hash << 5) - hash) + ch;
			hash = hash & hash;
		}
		return hash;
	}

	static token(value) {
		let hash = Pixies.hash(value);
		if (hash === 0) return null;
		let token = 'a';
		if (hash < 0) {
			token = 'b';
			hash = -hash;
		}
		return token + hash;
	}

	static addClass(element, css) {
		if (Array.isArray((css)) && css.length > 0) {
			css.forEach((cls) => {
				if (typeof cls === 'string' && cls.length > 0) element.classList.add(cls);
			});
		} else if (css) {
			css.split(' ').forEach((cls) =>	{
				if (typeof cls === 'string' && cls.length > 0) element.classList.add(cls);
			});
		}
	}

	static removeClass(element, css) {
		element.classList.remove(css);
	}

	static hasClass(element, css) {
		return element.classList.contains(css);
	}

	static toggleClass(element, css) {
		if (Pixies.hasClass(element, css)) {
			Pixies.removeClass(element, css);
		} else {
			Pixies.addClass(element, css);
		}
	}

	/**
	 *
	 * @param parent Element
	 * @param tag string
	 * @param css string|array|null
	 * @param innerText string|null
	 * @param onClick ()=>any|null
	 * @returns Element
	 */
	static createElement(parent, tag, css = null, innerText = null, onClick = null) {
		const el = document.createElement(tag);
		this.addClass(el, css);
		if (parent) {
			parent.appendChild(el);
		}
		if (innerText) {
			el.innerText = innerText;
		}
		if (onClick) {
			el.addEventListener('click', onClick);
		}
		return el;
	}

	static destroyElement(el) {
		if (el && el.parentNode && typeof el.parentNode.removeChild === 'function') {
			el.parentNode.removeChild(el);
		}
		if (el && typeof el.remove === 'function') {
			el.remove();
		}
	}

	static emptyElement(el) {
		if (el && el.textContent !== undefined) {
			el.textContent = '';
		}
	}

	static isFullscreen() {
		return (window.fullScreen || (window.innerWidth == screen.width && window.innerHeight == screen.height))
	}

	static openFullscreen(elem) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) { /* Safari */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE11 */
			elem.msRequestFullscreen();
		}
		Pixies.addClass(document.body, 'fullscreen');
	}

	static closeFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) { /* Safari */
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) { /* IE11 */
			document.msExitFullscreen();
		}
		Pixies.removeClass(document.body, 'fullscreen');
	}

	static clone(obj) {
		if (obj === null || obj === undefined) {
			return obj;
		}
		return JSON.parse(JSON.stringify(obj));
	}

	static toUnique(arr) {
		return arr.filter((value, index, self) => self.indexOf(value) === index);
	}

	static instantEditor(element, setter, textarea = false) {
		if (element.dataset.instantEditor === '1') {
			return;
		}
		element.dataset.instantEditor = '1';
		const text = element.innerText;
		Pixies.emptyElement(element);
		const editor = Pixies.createElement(element, 'form', 'instant-editor');
		const input = Pixies.createElement(editor, textarea ? 'textarea' : 'input');
		input.value = text;
		if (textarea) {
			const cancel = Pixies.createElement(editor, 'button');
			cancel.innerText = 'Cancel';
			cancel.addEventListener('click', (e) => {
				e.stopPropagation();
				Pixies.destroyElement(editor);
				element.innerText = text;
				element.dataset.instantEditor = '0';
			});
			const save = Pixies.createElement(editor, 'input');
			save.setAttribute('type', 'submit');
			save.value = 'Save';
		} else {
			input.setAttribute('type', 'text');
		}
		input.focus();
		editor.addEventListener('submit', (e) => {
			e.preventDefault();
			e.stopPropagation();
			const value = input.value;
			Pixies.destroyElement(editor);
			element.dataset.instantEditor = '0';
			element.innerText = value;
			setter(value);
		});
		if (!textarea) {
			editor.addEventListener('focusout', (e) => {
				Pixies.destroyElement(editor);
				element.innerText = text;
				element.dataset.instantEditor = '0';
			});
		}
	}

	static magicEditor(element, setter, textarea = false) {
		const addHintIfNeeded = () => {
			if (element.innerText.length === 0) {
				element.innerText = '(edit)';
			}
		}
		addHintIfNeeded();
		element.style.cursor = 'text';
		element.addEventListener('click', () => {
			Pixies.instantEditor(
				element,
				(value) => {
					setter(value);
					addHintIfNeeded();
				},
				textarea
			);
		});
	}

}
