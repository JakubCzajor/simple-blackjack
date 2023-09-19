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
    const [dealerAIComplete, setDealerAIComplete] = useState(false);

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
        setDealerAIComplete(false);
    }

    // useEffect(() => {
    //     checkIfGameOver()
    // }, [playerCardValue])

    // function checkIfGameOver() {
    //     if(playerCardValue > 21) {
    //         // setGame(false)
    //     }
    // }

    useEffect(() => {
        if (dealerCardValue >= 17) {
            setDealerAIComplete(true);
        }
    }, [dealerCardValue]);

    async function dealerAI() {
        while (dealerCardValue < 17) {
            await drawCard("dealer", 1);
            await updateDealerCardValue();
        }
    }

    async function updateDealerCardValue() {
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

    useEffect(() => {
        if (dealerAIComplete) {
            checkResults();
        }
    }, [dealerAIComplete]);

    async function checkResults() {
        if (playerCardValue > dealerCardValue) {
            console.log("You won")
        } else {
            console.log("You lost")
        }
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

    const handleClick = dealerAIComplete === false ? () => drawCard("player", 1) : console.log()
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
                <button className="game--button" onClick={handleClick}>Hit</button>
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
