class DOMElement {
  constructor(type) {
    this.type = type;
    this.attributes = {};
    this.eventListeners = {};
    this.children = [];
    this.textContent = null;
  }

  annexAttributes(attributes) {
    for (const key of Object.keys(attributes)) {
      if (attributes[key] === null) {continue;}
      this.attributes[key] = attributes[key];
    }
    return this;
  }

  annexTextContent(string) {
    this.textContent = string;
    return this;
  }

  annexChild(childElement) {
    this.children.push(childElement);
    return this;
  }

  annexEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    } else {
      this.eventListeners[event] = [callback];
    }
    return this;
  }

  build() {
    const item = document.createElement(this.type);

    // Attributes
    for (const key of Object.keys(this.attributes)) {
      item.setAttribute(key, this.attributes[key]);
    }
    // Text
    item.innerText = this.textContent;

    // Children
    for (const child of this.children) {
      item.appendChild(child.build());
    }

    // Events
    for (const event in this.eventListeners) {
      this.eventListeners[event].forEach((callback) => {
        item.addEventListener(event, callback);
      });
    }
    return item;
  }
}

export { DOMElement }