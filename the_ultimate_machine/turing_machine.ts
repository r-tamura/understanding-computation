export class Tape<T> {
  private left: T[];
  private middle: T;
  private right: T[];
  private blank: T;
  constructor(left: T[], middle: T, right: T[], blank: T) {
    this.left = left;
    this.middle = middle;
    this.right = right;
    this.blank = blank;
  }

  write(character: T) {
    return new Tape(this.left, character, this.right, this.blank);
  }

  moveHeadLeft() {
    return new Tape(
      this.left.slice(0, -1),
      this.left[this.left.length - 1] || this.blank,
      [this.middle, ...this.right],
      this.blank
    );
  }

  moveHeadRight() {
    return new Tape(
      [...this.left, this.middle],
      this.right[0] || this.blank,
      this.right.slice(1),
      this.blank
    );
  }

  toString() {
    return `#<Tape ${this.left.join("")}(${this.middle})${this.right.join(
      ""
    )}>`;
  }

  get headChar() {
    return this.middle;
  }
}

export class TMConfiguration<S, T> {
  state: S;
  tape: Tape<T>;
  constructor(state: S, tape: Tape<T>) {
    this.state = state;
    this.tape = tape;
  }
}

export const L = "left";
export const R = "right";
type Direction = "left" | "right";

export class TMRule<S, T> {
  private readonly state: S;
  private readonly character: T;
  private readonly nextState: S;
  private readonly writeChar: T;
  private readonly direction: Direction;
  constructor(
    state: S,
    character: T,
    nextState: S,
    writeChar: T,
    direction: Direction
  ) {
    this.state = state;
    this.character = character;
    this.nextState = nextState;
    this.writeChar = writeChar;
    this.direction = direction;
  }

  appliesTo(c: TMConfiguration<S, T>) {
    return this.state === c.state && this.character === c.tape.headChar;
  }

  follow(c: TMConfiguration<S, T>) {
    return new TMConfiguration(this.nextState, this.nextTape(c));
  }

  nextTape(c: TMConfiguration<S, T>) {
    const writtenTape = c.tape.write(this.writeChar);
    return this.direction === L
      ? writtenTape.moveHeadLeft()
      : writtenTape.moveHeadRight();
  }
}
