interface Node {
  replace(name: string, replacement: Node): Node;
  toString(): string;
}

export class LCVariable implements Node {
  private name: string;
  constructor(name: string) {
    this.name = name;
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
