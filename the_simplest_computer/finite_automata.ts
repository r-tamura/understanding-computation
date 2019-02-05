import { uniq, flatMap } from "../util";

export class FARule<StateType> {
  private state: StateType;
  private character: string;
  private nextState: StateType;

  constructor(state: StateType, character: string, nextState: StateType) {
    this.state = state;
    this.character = character;
    this.nextState = nextState;
  }

  appliesTo(state: StateType, character: string) {
    return this.state === state && this.character === character;
  }

  follow() {
    return this.nextState;
  }

  toString() {
    return `#<FA Rule ${this.state} --${this.character}--> ${this.nextState}`;
  }
}

export class DFARulebook<StateType> {
  private rules: FARule<StateType>[];
  constructor(...rules: FARule<StateType>[]) {
    this.rules = rules;
  }

  nextState(state: StateType, character: string) {
    const rule = this.ruleFor(state, character);
    return rule !== null ? rule.follow() : rule;
  }

  private ruleFor(state: StateType, character: string) {
    const appliesTo = (rule: FARule<StateType>) =>
      rule.appliesTo(state, character);
    const filtered = this.rules.filter(appliesTo);
    return filtered.length > 0 ? filtered[0] : null;
  }
}

export class DFA<S> {
  private currentState: S | null;
  private acceptStates: S[];
  private rulebook: DFARulebook<S>;

  constructor(currentState: S, acceptStates: S[], rulebook: DFARulebook<S>) {
    this.currentState = currentState;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  accepting() {
    if (this.isNull(this.currentState)) {
      return false;
    }
    return this.acceptStates.includes(this.currentState);
  }

  readChar(character: string) {
    if (this.isNull(this.currentState)) {
      return;
    }
    this.currentState = this.rulebook.nextState(this.currentState, character);
  }

  readString(s: string) {
    for (const c of s) {
      this.readChar(c);
    }
  }

  private isNull(v: any): v is null {
    return v === null;
  }
}

export class DFADesign<S> {
  private startState: S;
  private acceptState: S[];
  private rulebook: DFARulebook<S>;

  constructor(startState: S, acceptState: S[], rulebook: DFARulebook<S>) {
    this.startState = startState;
    this.acceptState = acceptState;
    this.rulebook = rulebook;
  }

  toDfa() {
    return new DFA(this.startState, this.acceptState, this.rulebook);
  }

  accepts(s: string) {
    return this.tap((dfa: DFA<S>) => dfa.readString(s))(
      this.toDfa()
    ).accepting();
  }

  private tap<T>(f: (s: T) => any | void) {
    const w = (x: T) => {
      f(x);
      return x;
    };
    return w;
  }
}

export class NFARulebook<S> {
  private rules: FARule<S>[];

  constructor(...rules: FARule<S>[]) {
    this.rules = rules;
  }

  nextStates(states: S[], character: string) {
    const xs1 = flatMap(s => this.followRulesFor(s, character), states);
    const xs2 = uniq(xs1);
    return xs2;
  }

  followRulesFor(state: S, character: string) {
    const follow = (rule: FARule<S>) => rule.follow();
    return this.rulesFor(state, character).map(follow);
  }

  rulesFor(state: S, character: string) {
    const appliesTo = (rule: FARule<S>) => rule.appliesTo(state, character);
    return this.rules.filter(appliesTo);
  }
}
