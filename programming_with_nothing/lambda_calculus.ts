interface Node {
  callable(): boolean;
  reducible(): boolean;
  replace(name: string, replacement: Node): Node;
  toString(): string;
}

export class LCVariable implements Node {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  callable() {
    return false;
  }

  reducible() {
    return false;
  }

  replace(name: string, replacement: Node) {
    return this.name === name ? replacement : this;
  }

  toString() {
    return this.name;
  }
}

export class LCFunction implements Node {
  private parameter: string;
  private body: Node;
  constructor(parameter: string, body: Node) {
    this.parameter = parameter;
    this.body = body;
  }

  call(argument: Node) {
    return this.body.replace(this.parameter, argument);
  }

  callable() {
    return true;
  }

  reducible() {
    return false;
  }

  replace(name: string, replacement: Node) {
    return this.parameter === name
      ? this
      : new LCFunction(this.parameter, this.body.replace(name, replacement));
  }

  toString() {
    return `-> ${this.parameter} { ${this.body} }`;
  }
}

export class LCCall implements Node {
  private left: Node;
  private right: Node;
  constructor(left: Node, right: Node) {
    this.left = left;
    this.right = right;
  }

  callable() {
    return false;
  }

  reducible() {
    return true;
  }

  reduce() {
    if (this.left.reducible()) {
      return new LCCall((this.left as LCCall).reduce(), this.right);
    } else if (this.right.reducible()) {
      return new LCCall(this.left, (this.right as LCCall).reduce());
    } else {
      return (this.left as LCFunction).call(this.right);
    }
  }

  replace(name: string, replacement: Node) {
    return new LCCall(
      this.left.replace(name, replacement),
      this.right.replace(name, replacement)
    );
  }

  toString() {
    return `${this.left}[${this.right}]`;
  }
}
