type Node = string | LCVariable | LCFunction | LCCall;

export class LCVariable {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

export class LCFunction {
  private parameter: string;
  private body: Node;
  constructor(parameter: string, body: Node) {
    this.parameter = parameter;
    this.body = body;
  }

  toString() {
    return `-> ${this.parameter} { ${this.body} }`;
  }
}

export class LCCall {
  private left: Node;
  private right: Node;
  constructor(left: Node, right: Node) {
    this.left = left;
    this.right = right;
  }

  toString() {
    return `${this.left}[${this.right}]`;
  }
}
