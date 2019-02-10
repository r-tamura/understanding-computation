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

export class PDAConfiguration<S, T> {
  public state: S;
  public stack: Stack<T>;
  constructor(state: S, stack: Stack<T>) {
    this.state = state;
    this.stack = stack;
  }
}

export class PDARule<S, T> {
  private state: S;
  private character: T;
  private nextState: S;
  private popChar: T;
  private pushChars: T[];

  constructor(state: S, character: T, nextState: S, popChar: T, popChars: T[]) {
    this.state = state;
    this.character = character;
    this.nextState = nextState;
    this.popChar = popChar;
    this.pushChars = popChars;
  }

  applisTo(configuration: PDAConfiguration<S, T>, character: T) {
    return (
      this.popChar === configuration.stack.top() && this.character === character
    );
  }

  follow(configuration: PDAConfiguration<S, T>) {
    return new PDAConfiguration(this.nextState, this.nextStack(configuration));
  }

  nextStack(configuration: PDAConfiguration<S, T>) {
    const poppedStack = configuration.stack.pop();
    return this.pushChars
      .reverse()
      .reduce((acc, c) => acc.push(c), poppedStack);
  }
}

export class DPDARulebook<S, T> {
  private rules: PDARule<S, T>[];
  constructor(...rules: PDARule<S, T>[]) {
    this.rules = rules;
  }

  nextConfiguration(configuration: PDAConfiguration<S, T>, character: T) {
    const rule = this.ruleFor(configuration, character);
    return rule !== null ? rule.follow(configuration) : null;
  }

  ruleFor(configuration: PDAConfiguration<S, T>, character: T) {
    const filtered = this.rules.filter(x =>
      x.applisTo(configuration, character)
    );
    return filtered.length > 0 ? filtered[0] : null;
  }
}
