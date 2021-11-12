export default class Elements {
    constructor() {
        this.elements = [];
    }

    add(element) {
        if (!element || !element.key) {
            throw new Error("[INVALID ELEMENT]");
        }
        this.remove(element.key);
        this._push(element);
    }

    clear() {
        this.elements = [];
    }

    get(key) {
        var elements = this.elements.filter(function (item) {
            return item.key == key;
        });

        return elements.length ? elements[0] : undefined;
    }

    remove(key) {
        let element = undefined;

        this.elements = this.elements.filter(function (item) {
            let result = item.key !== key;

            if (!result) {
                element = item;
            }

            return item.key !== key;
        });

        return element;
    }

    _push(element) {
        this.elements.push(element);
    }
}

