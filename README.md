# rock-paper-scissors

This a blockchain based rock paper scissors game. Enjoy it.

## Intructions of the exercise

Write a Smart Contract in Solidity to model the Rock, Paper, Scissors game. The
requirements are:

1. A game is played by two participants in which one challenges the other.
2. An event must be logged when one player wins the game.
3. Appropriate tests must be implemented (if some tests are not included, at least specify
   which cases would be covered).
4. Include a README.md file with instructions on how to set up the environment and run
   the tests.
5. (Optional) Allow players to bet on the native token of the network (ETH, RBTC, ETC).
   How would this be implemented if you wanted to bet on compatible ERC-20 tokens?
6. (Optional) Implement a super simple interface that allows people to play using
   Metamask.
7. (Help) Keep in mind that transactions are executed in sequence. How could a move be
   made without the other player knowing the chosen element(rock, paper or Scissors)?
   Consider that the game can be played in several turns.

## Intructions to run the tests

1 - Clone the repository

```sh
git clone git@github.com:hanzel98/rock-paper-scissors.git
```

2 - Go to the cloned repository in the local machine, and inside the /client folder run `npm install`

3 - Make sure to have truffle installed.

4 - Download and install Ganache, and configure a new workspace with this values:

- Host: 127.0.0.1
- Port: 7545
- Network id: 5777
- Create at least 3 different unlockced accounts with funds

5 - Open a terminal inside the root of the project /rock-paper-scissors and run `truffle test` , after that the tests should start running. If all them passed the application is working properly.

## Intructions to play

1 - It is necessary to follow the previous instructions for tests before beginning these instructions.

2 - Download Firefox and Google Chrome. (Two browsers are needed)

3 - Install the Metamask extension in each browser and follow the next steps to configure it:

- Open and create you metamask wallet, once you are inside create a new network in the option Networks/Custom RPC and insert these values `New RPC URL: 127.0.0.1 Chain Id: 1337` then change to this network.
- Open the gananche instance that is running and copy the private key of the first account.
- Go to one of the metamask extensions in one of the browsers and inside Accounts/Import Account paste the first private key.
- Repeat the process to configure the second account, but this time with a differen private key and a different browser.
- If everything went well in these steps you will have two browsers connected to the local ganache, and you will be using two different accounts that will have ethers.

4 - Open a terminal and go to the project root folder then run `truffle console`, after that type `migrate`, this will compile and migrate the smart contracts.

5 - Open a terminal and move to the /rock-paper-scissors/client folder then run npm run start, this will start the server that will open run the UI here <http://localhost:3000>

## Demo in video

Application: <https://youtu.be/TQrwd7zdorU>

Tests: <https://youtu.be/ob-42PSaQr8>

## Proposal for missing features

### How could a move be made without the other player knowing the chosen element (rock, paper or scissors)?

- Currently if someone listens to the smart contract that person will be able to know the input that the opponent chose. One possible solution for this is that both players hash their answers with a random string and initially send just the hash as the answer to the smart contract, the opponnt will not be able to know what was the answer, even if he can see the input that was used in the smart contract. The hash is saved in the smart contract for both players. Once both of them sent the hash they can now send the real answer without the hash but they will also include the random string that they used to hash it iniatially. With those two values the smart contract can replicate the hash and validate that the initial choice was not changed. In each round the hash saved in the smart contract will be reset and also the random string will be generated again for the next round.
