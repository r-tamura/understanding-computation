export class Stack<T> {
  private contents: T[];
  constructor(...contents: T[]) {
    this.contents = contents;
  }

  push(c: T): Stack<T> {
    return new Stack(c, ...this.contents);
  }

  pop(): Stack<T> {
    if (this.contents.length === 0) {
      throw new RangeError();
    }
    return new Stack(...this.contents.slice(1));
  }

  top(): T {
    if (this.contents.length === 0) {
      throw new RangeError();
    }
    return this.contents[0];
  }

  toString() {
    return `#<Stack (${this.top()})${this.contents.slice(1).join()}`;
  }
}

export class Configuration<S, T> {}
