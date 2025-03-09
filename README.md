# EPFL Blockchain Student Association Hack 2025
### Topic: "Privacy x Verifiability". March 8-9, 2025

# zkVoting App
![zkVoting_logo_2](https://github.com/user-attachments/assets/43e7b81c-473a-4bbf-b7f6-15e116df737c)

The program simulates a simple voting mechanism using a zkApp built with o1js (Mina). It demonstrates a zero-knowledge voting system where users can cast votes securely on a blockchain while ensuring the votes are counted correctly and verifiably. Instead of a traditional voting system where every vote is openly recorded, this system ensures verifiability using cryptographic proofs while maintaining the integrity of the voting process.

# What the Demonstration Code Does
It deploys a smart contract that tracks votes, and then it executes a transaction that casts a “yes” vote, updating and verifying the on-chain state. The final printed output confirms that the contract correctly recorded one vote in favor.

# How to Run
```
npx ts-node zk-voting-demo/src/main.ts
```
# Expected Output
```
Compiling VotingContract...
Deploying Voting Contract...
Voting YES...
Votes For: 1
Votes Against: 0
```
