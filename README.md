# EPFL Blockchain Student Association Hack 2025
Privacy X Verifiability
![zkVoting_logo_2](https://github.com/user-attachments/assets/43e7b81c-473a-4bbf-b7f6-15e116df737c)
# zkVoting App

The program simulates a simple voting mechanism using a zkApp built with o1js. It demonstrates a zero-knowledge voting system where users can cast votes securely on a blockchain while ensuring the votes are counted correctly and verifiably. Instead of a traditional voting system where every vote is openly recorded, this system ensures verifiability using cryptographic proofs while maintaining the integrity of the voting process.

# What the Demonstration Code Does
It deploys a smart contract that tracks votes, and then it executes a transaction that casts a “yes” vote, updating and verifying the on-chain state. The final printed output confirms that the contract correctly recorded one vote in favor.

# How to Run
npx ts-node zk-voting-demo/src/main.ts
