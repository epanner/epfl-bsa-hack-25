import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Provable,
  Bool,
} from 'o1js';

export class VotingContract extends SmartContract {
  @state(Field) votesFor: State<Field> = State<Field>();
  @state(Field) votesAgainst: State<Field> = State<Field>();

  init() {
    super.init();
    this.votesFor.set(new Field(0));
    this.votesAgainst.set(new Field(0));
  }

  @method
  async vote(voteFor: Bool): Promise<void> {
    // Add preconditions linking the on-chain state to the local values.
    this.votesFor.requireEquals(this.votesFor.get());
    this.votesAgainst.requireEquals(this.votesAgainst.get());

    const currentVotesFor = this.votesFor.get();
    const currentVotesAgainst = this.votesAgainst.get();

    const newVotesFor = Provable.if(voteFor, currentVotesFor.add(new Field(1)), currentVotesFor);
    const newVotesAgainst = Provable.if(voteFor.not(), currentVotesAgainst.add(new Field(1)), currentVotesAgainst);

    this.votesFor.set(newVotesFor);
    this.votesAgainst.set(newVotesAgainst);
  }
}