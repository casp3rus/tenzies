import { useEffect, useState } from 'react';
import './App.css';
import Die from './components/Die';
import Stats from './components/Stats'
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';


function App() {
  const bestGameRoll = JSON.parse(localStorage.getItem('tenziesRolls'));

  const bestGame = {
    rolls: bestGameRoll ? bestGameRoll : 0,
    time: 0,
  }

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rolls, setRolls] = useState(0)

  useEffect(() => {
    dice.every((die) => die.isHeld && dice[0].value === die.value) ?
      setTenzies(true) :
      console.log('Keep Rolling')
  }, [dice])


  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false
    }
  }

  function allNewDice() {
    return Array.from({ length: 10 }, () => generateNewDie())
  }

  function saveBestGame() {
    if (bestGame.rolls === 0 || bestGame.rolls > rolls) {
      localStorage.setItem('tenziesRolls', JSON.stringify(rolls))
    }
  }

  function rollDice() {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(die => die.isHeld ? die : generateNewDie()))
      setRolls(prevRolls => prevRolls + 1)
    } else {
      saveBestGame()
      setTenzies(false)
      setRolls(0)
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
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at it's current value between rolls.</p>
      <Stats title={'Best'} rolls={bestGame.rolls} />
      <Stats title={'Current'} rolls={rolls} />
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className='roll-button'
        onClick={rollDice}
      >
        {tenzies ? 'new game' : 'roll'}
      </button>
    </main>
  );
}

export default App;
