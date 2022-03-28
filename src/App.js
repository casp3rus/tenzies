import { useEffect, useState } from 'react';
import './App.css';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';


function App() {

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)

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

  function rollDice() {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(die => die.isHeld ? die : generateNewDie()))
    } else {
      setTenzies(false)
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
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
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
