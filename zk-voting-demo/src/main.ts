import { Mina, PrivateKey, AccountUpdate, Bool } from 'o1js';
import { VotingContract } from './VotingContract';

async function main() {
  // Compile the contract to generate the verification key
  console.log("Compiling VotingContract...");
  await VotingContract.compile();

  // Await the initialization of LocalBlockchain
  const Local = await Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  // Get test account properly
  const deployerAccount = Local.testAccounts[0];
  const deployer = deployerAccount.key; // Private Key
  const deployerPublicKey = deployer.toPublicKey(); // Convert PrivateKey to PublicKey

  const zkAppKey = PrivateKey.random();
  const zkAppAddress = zkAppKey.toPublicKey();
  const zkApp = new VotingContract(zkAppAddress);

  console.log('Deploying Voting Contract...');
  let txn = await Mina.transaction(
    { sender: deployerPublicKey, fee: 100_000_000 },
    async () => {
      AccountUpdate.fundNewAccount(deployerPublicKey);
      await zkApp.deploy();
    }
  );
  await txn.sign([deployer, zkAppKey]).send();

  console.log('Voting YES...');
  txn = await Mina.transaction(
    { sender: deployerPublicKey, fee: 100_000_000 },
    async () => {
      await zkApp.vote(Bool(true));
    }
  );
  await txn.prove();
  await txn.sign([deployer]).send();

  const votesFor = zkApp.votesFor.get().toString();
  const votesAgainst = zkApp.votesAgainst.get().toString();

  console.log(`Votes For: ${votesFor}`);
  console.log(`Votes Against: ${votesAgainst}`);
}

main().catch(console.error);