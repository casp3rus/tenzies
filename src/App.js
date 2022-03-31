import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

import Die from './components/Die';
import Stats from './components/Stats';

import './App.css';

function App() {
  const savedGame = JSON.parse(localStorage.getItem('bestGame'));

  const bestGame = savedGame
    ? savedGame
    : {
        rolls: 0,
        time: 0,
      };

  const [dice, setDice] = useState(allNewDice());
  const [game, setGame] = useState(allNewGame());

  useEffect(() => {
    dice.every((die) => die.isHeld && dice[0].value === die.value)
      ? setGame((prevGame) => ({ ...prevGame, tenzies: true }))
      : console.log('Keep Rolling');
  }, [dice]);

  useEffect(() => {
    if (!game.tenzies) {
      let interval = null;
      interval = setInterval(() => {
        setGame((prevGame) => ({ ...prevGame, time: prevGame.time + 1 }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [game.time]);

  function allNewDice() {
    return Array.from({ length: 10 }, () => generateNewDie());
  }

  function allNewGame() {
    return {
      tenzies: false,
      rolls: 0,
      time: 0,
    };
  }

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function saveBestRoll() {
    if (bestGame.rolls > game.rolls || bestGame.rolls === 0) {
      bestGame.rolls = game.rolls;
    }
  }

  function saveBestTime() {
    if (bestGame.time > game.time || bestGame.time === 0) {
      bestGame.time = game.time;
    }
  }

  function rollDice() {
    if (!game.tenzies) {
      setDice((prevDice) =>
        prevDice.map((die) => (die.isHeld ? die : generateNewDie()))
      );
      setGame((prevGame) => ({ ...prevGame, rolls: prevGame.rolls + 1 }));
    } else {
      saveBestRoll();
      saveBestTime();
      localStorage.setItem('bestGame', JSON.stringify(bestGame));
      setGame(allNewGame());
      setDice(allNewDice());
    }
  }

  function holdDie(id) {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDie={() => holdDie(die.id)}
    />
  ));

  return (
    <main>
      {game.tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at it's
        current value between rolls.
      </p>
      <Stats title={'Best'} rolls={bestGame.rolls} time={bestGame.time} />
      <Stats title={'Current'} rolls={game.rolls} time={game.time} />
      <div className="dice-container">{diceElements}</div>
      <button className="roll-button" onClick={rollDice}>
        {game.tenzies ? 'new game' : 'roll'}
      </button>
    </main>
  );
}

export default App;
