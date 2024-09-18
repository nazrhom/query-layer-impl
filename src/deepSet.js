export class DeepSet {
  constructor(comparator) {
    this.items = []; // To store objects
    this.comparator = comparator;
  }

  add(item) {
    if (!this.has(item)) {
      this.items.push(item);
    }
  }

  has(item) {
    return this.items.some(existingItem => this.comparator(existingItem, item));
  }

  delete(item) {
    const index = this.items.findIndex(existingItem => this.comparator(existingItem, item));
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  get size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}
