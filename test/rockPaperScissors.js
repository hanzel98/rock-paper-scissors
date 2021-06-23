const RockPaperScissors = artifacts.require("./RockPaperScissors.sol");

contract("RockPaperScissors", accounts => {
  let rockPaperScissors = null;
  before(async ()=> {
    rockPaperScissors = await RockPaperScissors.deployed();
  });

  it('Should start with empty players', async () => {
    const players = await rockPaperScissors.getPlayers();
    assert.equal(players[0], '0x0000000000000000000000000000000000000000', 'Player 1 is not empty');
    assert.equal(players[1], '0x0000000000000000000000000000000000000000', 'Player 2 is not empty');
  });

  it('Should not be able to start choosing an option without having at least two players in the game', async () => {
    try {
      const playerChoice = 1;
      await rockPaperScissors.chooseAnOption(playerChoice, { from: accounts[0] })
    } catch (error) {
      assert.equal(error.reason, 'Please join the game before you choose an option');
      return;
    }
    assert(false, 'At least two players joined in the game validation failed');
  });
    
  it('Should join a game', async () => {
    await rockPaperScissors.joinGame({ from: accounts[0] });
    await rockPaperScissors.joinGame({ from: accounts[1] });
    const players = await rockPaperScissors.getPlayers();
    assert.equal(players[0], accounts[0], 'The player 1 was not assigned correctly');
    assert.equal(players[1], accounts[1], 'The player 2 was not assigned correctly');
  });

  it('Should have different addresses for player 1 and player 2', async () => {
    const players = await rockPaperScissors.getPlayers();
    assert(players[0] !== players[1], 'Player 1 and player 2 must be different addresses');
  });

  it('Should not be able to join a game more than once with the same address', async () => {
    try {
      await rockPaperScissors.joinGame({ from: accounts[0] });
    } catch (error) {
      assert.equal(error.reason, 'This address already joined as player 1');
      return;
    }
    try {
      await rockPaperScissors.joinGame({ from: accounts[1] });
    } catch (error) {
      assert.equal(error.reason, 'This address already joined as player 2');
      return;
    }
    assert(false, 'Join validation alreadyJoined failed');
  });


  it('Should not be able to join a game with more than two players', async () => {
    try {
      await rockPaperScissors.joinGame({ from: accounts[2] });
    } catch (error) {
      assert.equal(error.reason, 'There is no space for new players');
      return;
    }
    assert(false, 'This validation failed: There is no space for new players');
  });

  it('Should not be able to choose the not valid option', async () => {
    try {
      const notValidOption = 0;
      await rockPaperScissors.chooseAnOption(notValidOption, { from: accounts[0] });
    } catch (error) {
      assert.equal(error.reason, 'The choice NOT PLAYED is not valid');
      return;
    }
    assert(false, 'Not valid option validation failed');
  });

  it('Should choose an option for player1', async () => {
      const playerChoice = 1; // Choosing Rock
      const response = await rockPaperScissors.chooseAnOption(playerChoice, { from: accounts[0] });
      assert.equal(response.receipt.status, true);
  });

  it('Should not be able to choose an option twice before the game restarts', async () => {
    try {
      const playerChoice = 2; // Now choosing Paper
      await rockPaperScissors.chooseAnOption(playerChoice, { from: accounts[0] });
    } catch (error) {
      assert.equal(error.reason, 'You already played');
      return;
    }
    assert(false, 'Player already played validation failed');
  });

  it('Should choose an option for player2 and return a winner as an event', async () => {
    const playerChoice = 1; // Choosing Rock
    const response = await rockPaperScissors.chooseAnOption(playerChoice, { from: accounts[1] });
    const loserAnnouncement = response.logs[0].args['loserAnnouncement'];
    const winnerAnnouncement = response.logs[0].args['winnerAnnouncement'];
    const winner = response.logs[0].args['winner'];
    assert(loserAnnouncement.includes('The loser chose:'), 'The loser was not announced');
    assert(winnerAnnouncement.includes('The winner chose:'), 'The winner was not announced');
    assert(winner.includes('0x') && winner.length === 42, 'The winner has an invalid format');
    assert.equal(response.receipt.status, true);
  });

  it('Should be able to choose an option again after a reset, and it should work with a draw', async () => {
    const playerChoice = 2; // Choosing Paper
    await rockPaperScissors.chooseAnOption(playerChoice, { from: accounts[0] });
    const response = await rockPaperScissors.chooseAnOption(playerChoice, { from: accounts[1] });
    const loserAnnouncement = response.logs[0].args['loserAnnouncement'];
    const winnerAnnouncement = response.logs[0].args['winnerAnnouncement'];
    const winner = response.logs[0].args['winner'];
    assert(loserAnnouncement.replaceAll('loser', 'player') === winnerAnnouncement.replaceAll('winner', 'player'), 'The winner and loser should be the same because it is a draw');
    assert.equal(winner, '0x0000000000000000000000000000000000000000', 'The winner should be 0x00 because it is a draw');
    assert.equal(response.receipt.status, true, 'The players should be able to choose an option again after the game restarts');
  });

  it('Should announce rock as winner against scissors', async () => {
    const player1Choice = 3; // Choosing Paper
    const player2Choice = 1; // Choosing Rock
    await rockPaperScissors.chooseAnOption(player1Choice, { from: accounts[0] });
    const response = await rockPaperScissors.chooseAnOption(player2Choice, { from: accounts[1] });
    const winner = response.logs[0].args['winner'];
    const winnerAnnouncement = response.logs[0].args['winnerAnnouncement'];
    assert.equal(winnerAnnouncement, 'The winner chose: Rock', 'The winner should be Rock');
    assert.equal(winner, accounts[1], 'The winner should be player2');
    assert.equal(response.receipt.status, true);
  });

  it('Should announce scissors as winner against paper', async () => {
    const player1Choice = 2; // Choosing Paper
    const player2Choice = 3; // Choosing Scissors
    await rockPaperScissors.chooseAnOption(player1Choice, { from: accounts[0] });
    const response = await rockPaperScissors.chooseAnOption(player2Choice, { from: accounts[1] });
    const winner = response.logs[0].args['winner'];
    const winnerAnnouncement = response.logs[0].args['winnerAnnouncement'];
    assert.equal(winnerAnnouncement, 'The winner chose: Scissors', 'The winner should be Scissors');
    assert.equal(winner, accounts[1], 'The winner should be player2');
    assert.equal(response.receipt.status, true);
  });

  it('Should announce paper as winner against rock', async () => {
    const player1Choice = 1; // Choosing Rock
    const player2Choice = 2; // Choosing Paper
    await rockPaperScissors.chooseAnOption(player1Choice, { from: accounts[0] });
    const response = await rockPaperScissors.chooseAnOption(player2Choice, { from: accounts[1] });
    const winner = response.logs[0].args['winner'];
    const winnerAnnouncement = response.logs[0].args['winnerAnnouncement'];
    assert.equal(winnerAnnouncement, 'The winner chose: Paper', 'The winner should be Paper');
    assert.equal(winner, accounts[1], 'The winner should be player2');
    assert.equal(response.receipt.status, true);
  });
});
