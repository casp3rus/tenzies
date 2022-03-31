import { useEffect, useState } from 'react';
import './App.css';
import Die from './components/Die';
import Stats from './components/Stats'
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';


function App() {
  const savedGame = JSON.parse(localStorage.getItem('bestGame'));

  const bestGame = savedGame ? savedGame :
    {
      rolls: 0,
      time: 0,
    }
  
  console.log(bestGame)

  const newGame = {
    tenzies: false,
    rolls: 0,
    time: 0,
  }

  const [dice, setDice] = useState(allNewDice())
  const [game, setGame] = useState(newGame)

  useEffect(() => {
    dice.every((die) => die.isHeld && dice[0].value === die.value) ?
      setGame(prevGame => ({ ...prevGame, tenzies: true })) :
      console.log('Keep Rolling')
  }, [dice])

  function allNewDice() {
    return Array.from({ length: 10 }, () => generateNewDie())
  }

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false
    }
  }

  useEffect(() => {
    if (!game.tenzies) {
      const startTime = Date.now()
      setTimeout(() => setGame(oldGame => ({ ...oldGame, time: Math.floor(oldGame.time + (Date.now() - startTime) / 1000) })), 1000)
    } else {
      // saveBestTime()
    }
  }, [game.time])

  function saveGameToLocalStorage() {
    if (bestGame.rolls > game.rolls || bestGame.rolls === 0) {
      bestGame.rolls = game.rolls
    } else if (bestGame.time > game.time || bestGame.time === 0) {
      bestGame.time = game.time
    }

    localStorage.setItem('bestGame', JSON.stringify(bestGame))
  }

  function rollDice() {
    if (!game.tenzies) {
      setDice(prevDice => prevDice.map(die => die.isHeld ? die : generateNewDie()))
      setGame(prevGame => ({ ...prevGame, rolls: prevGame.rolls + 1 }))
    } else {
      saveGameToLocalStorage()
      setGame(newGame)
      setDice(allNewDice())
    }
  }

  function holdDie(id) {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id ? { ...die, isHeld: !die.isHeld } : die
    }))
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDie={() => holdDie(die.id)}
    />
  ))

  return (
    <main>
      {game.tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at it's current value between rolls.</p>
      <Stats title={'Best'} rolls={bestGame.rolls} time={bestGame.time} />
      <Stats title={'Current'} rolls={game.rolls} time={game.time} />
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className='roll-button'
        onClick={rollDice}
      >
        {game.tenzies ? 'new game' : 'roll'}
      </button>
    </main>
  );
}

export default App;
