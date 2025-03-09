# EPFL Blockchain Student Association Hack 2025
![zkVoting_logo](https://github.com/user-attachments/assets/c1cf6abb-058a-46d1-9f32-f63b8dad66f1)
# zkVoting App

The program simulates a simple voting mechanism using a zkApp built with o1js. It is demonstrating a zero-knowledge voting system where users can cast votes securely on a blockchain while ensuring the votes are counted correctly and verifiably. Instead of a traditional voting system where every vote is openly recorded, this system ensures verifiability using cryptographic proofs while maintaining the integrity of the voting process.

# What the Demonstration Code Does
It deploys a smart contract that tracks votes, and then it executes a transaction that casts a “yes” vote, updating and verifying the on-chain state. The final printed output confirms that the contract correctly recorded one vote in favor.

# How to Run
npx ts-node zk-voting-demo/src/main.ts
