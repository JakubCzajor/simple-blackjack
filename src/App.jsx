import { useState, useEffect } from 'react'
import Card from "./components/Card"
import { nanoid } from 'nanoid'

export default function App() {

    const [game, setGame] = useState(false)
    const [deck, setDeck] = useState({})
    const [playerCards, setPlayerCards] = useState([])
    const [playerCardValue, setPlayerCardValue] = useState(0)
    const [dealerCards, setDealerCards] = useState([])
    const [dealerCardValue, setDealerCardValue] = useState(0)

    useEffect(() => {
        fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=4")
        .then(res => res.json())
        .then(data => setDeck(data))
    }, [game])

    function setupGame() {
        setGame(true)
        setPlayerCards([])
        setPlayerCardValue(0)
        drawCard("player", 2)
        setDealerCards([])
        setDealerCardValue(0)
        drawCard("dealer", 1)
    }

    useEffect(() => {
        checkIfGameOver()
    }, [playerCardValue])

    function checkIfGameOver() {
        if(playerCardValue > 21) {
            // setGame(false)
        }
    }

    async function dealerAI() {
        while (dealerCardValue < 17) {
            await drawCard("dealer", 1);
      
            await new Promise((resolve) => {
                setDealerCardValue((prevValue) => {
                    if (prevValue < 17) {
                        resolve();
                        return prevValue;
                    }
                    return prevValue;
                });
            });
        }
      }

    function checkResults() {
        if (playerCardValue > dealerCardValue) {
            console.log("You won")
        } else {
            console.log("You lost")
        }
        // if my cards are higher than opponent, then I win, else I lose
    }

    const drawCard = async(pl, num) => {
        try {
            const data = await (
                await fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${num}`)
            ).json()
            const newCards = data.cards
            newCards.forEach(element => {
                pl === "player" ?
                    setPlayerCards(oldDeck => {return [...oldDeck, element]}) :
                    setDealerCards(oldDeck => {return [...oldDeck, element]})
                updateCardValue(pl, element.value)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    function updateCardValue(pl, card) {
        const value = isNaN(card) ? 10 : parseInt(card)
        pl === "player" ?
            setPlayerCardValue(oldValue => oldValue + value) :
            setDealerCardValue(oldValue => oldValue + value)
    }

    const playerCardElements = playerCards.map(card => <Card key={nanoid()} image={card.image} value={card.value} />)
    const dealerCardElements = dealerCards.map(card => <Card key={nanoid()} image={card.image} value={card.value} />)

    return (
    <main>
    {
        game === false
        ?
        <button className="start--button" onClick={setupGame}>Start Game</button>
        :
        <>
            <h1>Simple Blackjack</h1>
            <p>Your cards value: {playerCardValue}</p>
            <p>Dealer's cards value: {dealerCardValue}</p>
            <div className="buttons--container">
                <button className="game--button" onClick={() => drawCard("player", 1)}>Hit</button>
                <button className="game--button" onClick={dealerAI}>Stand</button> 
            </div>
            <div className="card--container">
                <div className="player--container">
                    {playerCardElements}
                </div>
                <div className="player--container">
                    {dealerCardElements}
                </div>
            </div>
        </>
    }
    </main>
  )
}
