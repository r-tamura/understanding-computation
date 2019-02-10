/**
 * プッシュダウンオートマトンの実装
 * 型Sは状態の型、型Tは入力の型をあらわす。
 */
import {
  reverse,
  flatMap,
  uniq,
  uniqBy,
  isSubset,
  intersection
} from "../util";

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
      throw new RangeError("stack is empty");
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

  applisTo(configuration: PDAConfiguration<S, T>, character: T | null) {
    return (
      this.state === configuration.state &&
      this.popChar === configuration.stack.top() &&
      this.character === character
    );
  }

  follow(configuration: PDAConfiguration<S, T>) {
    return new PDAConfiguration(this.nextState, this.nextStack(configuration));
  }

  nextStack(configuration: PDAConfiguration<S, T>) {
    const poppedStack = configuration.stack.pop();
    return reverse(this.pushChars).reduce((acc, c) => acc.push(c), poppedStack);
  }
}

export class DPDARulebook<S, T> {
  private rules: PDARule<S, T>[];
  constructor(...rules: PDARule<S, T>[]) {
    this.rules = rules;
  }

  nextConfiguration(
    configuration: PDAConfiguration<S, T>,
    character: T | null
  ) {
    const rule = this.ruleFor(configuration, character);
    return rule !== null ? rule.follow(configuration) : null;
  }

  ruleFor(configuration: PDAConfiguration<S, T>, character: T | null) {
    const filtered = this.rules.filter(x =>
      x.applisTo(configuration, character)
    );
    return filtered.length > 0 ? filtered[0] : null;
  }

  followFreeMoves(
    configuration: PDAConfiguration<S, T>
  ): PDAConfiguration<S, T> {
    if (this.applisTo(configuration, null)) {
      const nextConfiguration = this.nextConfiguration(configuration, null);
      if (nextConfiguration === null) {
        return configuration;
      }
      return this.followFreeMoves(nextConfiguration);
    } else {
      return configuration;
    }
  }

  applisTo(configuration: PDAConfiguration<S, T>, character: T | null) {
    return this.ruleFor(configuration, character) !== null;
  }
}

export class DPDA<S, T> {
  private _currentConfiguration: PDAConfiguration<S, T> | null;
  private acceptStates: S[];
  private rulebook: DPDARulebook<S, T>;

  constructor(
    currentConfiguration: PDAConfiguration<S, T>,
    acceptStates: S[],
    rulebook: DPDARulebook<S, T>
  ) {
    this._currentConfiguration = currentConfiguration;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  get currentConfiguration() {
    if (this._currentConfiguration === null) {
      return null;
    }
    return this.rulebook.followFreeMoves(this._currentConfiguration);
  }

  accepting() {
    if (this.currentConfiguration === null) {
      return false;
    }
    return this.acceptStates.includes(this.currentConfiguration.state);
  }

  readChar(character: T) {
    if (this.currentConfiguration === null) {
      return;
    }
    this._currentConfiguration = this.rulebook.nextConfiguration(
      this.currentConfiguration,
      character
    );
  }

  readString(str: Iterable<T>) {
    for (const c of str) {
      if (this.isStuck()) {
        return;
      }
      this.readChar(c);
    }
  }

  isStuck() {
    return this.currentConfiguration === null;
  }
}

export class DPDADesign<S, T> {
  private startState: S;
  private bottomChar: T;
  private acceptStates: S[];
  private rulebook: DPDARulebook<S, T>;

  constructor(
    startState: S,
    bottomChar: T,
    acceptStates: S[],
    rulebook: DPDARulebook<S, T>
  ) {
    this.startState = startState;
    this.bottomChar = bottomChar;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  accepts(str: Iterable<T>) {
    const dpda = this.toDpda();
    dpda.readString(str);
    return dpda.accepting();
  }

  toDpda() {
    const startStack = new Stack(this.bottomChar);
    const startConfiguration = new PDAConfiguration(
      this.startState,
      startStack
    );
    return new DPDA(startConfiguration, this.acceptStates, this.rulebook);
  }
}

export class NPDARulebook<S, T> {
  private rules: PDARule<S, T>[];
  constructor(...rules: PDARule<S, T>[]) {
    this.rules = rules;
  }

  nextConfigurations(
    configurations: PDAConfiguration<S, T>[],
    character: T | null
  ) {
    const xs1 = flatMap(
      configuration => this.fowlloRulesFor(configuration, character),
      configurations
    );
    const keyFn = (c: PDAConfiguration<S, T>) => {
      return JSON.stringify(c);
    };
    const xs2 = uniqBy(keyFn, xs1);
    return xs2;
  }

  fowlloRulesFor(configuration: PDAConfiguration<S, T>, character: T | null) {
    return this.rulesFor(configuration, character).map(rule =>
      rule.follow(configuration)
    );
  }

  rulesFor(configuration: PDAConfiguration<S, T>, character: T | null) {
    return this.rules.filter(rule => rule.applisTo(configuration, character));
  }

  followFreeMoves(
    configurations: PDAConfiguration<S, T>[]
  ): PDAConfiguration<S, T>[] {
    const moreConfigurations = this.nextConfigurations(configurations, null);
    if (isSubset(moreConfigurations, configurations, JSON.stringify)) {
      return configurations;
    }
    return this.followFreeMoves([...configurations, ...moreConfigurations]);
  }
}

export class NPDA<S, T> {
  private _curentConfigurations: PDAConfiguration<S, T>[];
  private acceptStates: S[];
  private rulebook: NPDARulebook<S, T>;
  constructor(
    curentConfigurations: PDAConfiguration<S, T>[],
    acceptStates: S[],
    rulebook: NPDARulebook<S, T>
  ) {
    this._curentConfigurations = curentConfigurations;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  get currentConfigurations() {
    return this.rulebook.followFreeMoves(this._curentConfigurations);
  }

  accepting() {
    return (
      intersection(
        this.currentConfigurations.map(c => c.state),
        this.acceptStates
      ).length > 0
    );
  }

  readChar(character: T) {
    this._curentConfigurations = this.rulebook.nextConfigurations(
      this.currentConfigurations,
      character
    );
  }

  readString(str: Iterable<T>) {
    for (const c of str) {
      this.readChar(c);
    }
  }
}

export class NPDADesign<S, T> {
  private startState: S;
  private bottomChar: T;
  private acceptStates: S[];
  private rulebook: NPDARulebook<S, T>;

  constructor(
    startState: S,
    bottomChar: T,
    acceptStates: S[],
    rulebook: NPDARulebook<S, T>
  ) {
    this.startState = startState;
    this.bottomChar = bottomChar;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  accepts(str: Iterable<T>) {
    const dpda = this.toNpda();
    dpda.readString(str);
    return dpda.accepting();
  }

  toNpda() {
    const startStack = new Stack(this.bottomChar);
    const startConfiguration = new PDAConfiguration(
      this.startState,
      startStack
    );
    return new NPDA([startConfiguration], this.acceptStates, this.rulebook);
  }
}
