export type State = number | null;

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

export class DFARuleBook<StateType> {
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
