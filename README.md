# epfl-bsa-hack-25

## Project Overview
We’re building a privacy-preserving, distributed ML prototype where multiple participants train a shared model without revealing their private datasets. The system uses Node.js + TypeScript for the core logic and leverages zero-knowledge proofs (or secure aggregation) to ensure each participant can prove their model updates are valid while keeping their raw data hidden. The end goal is a minimal, end-to-end demo showing that collaborative training is possible without compromising data privacy.
 
### To setup (only need to be done once):

npm install typescript --save-dev
npm install o1js
npm i mina-attestations