import { useState, useEffect } from 'react'
import Card from "./components/Card"

export default function App() {

    const [game, setGame] = useState(false)
    const [deck, setDeck] = useState({})
    const [playerCards, setPlayerCards] = useState([{}])
    const [playerCardValue, setPlayerCardValue] = useState(0)

    useEffect(() => {
        fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(res => res.json())
        .then(data => setDeck(data))
    }, [game])

    function setupGame() {
        setGame(true)
        drawCard(2)
    }

    // useEffect(() => {
    //     checkGameOver()
    // }, [playerCardValue])

    // function checkGameOver() {
    //     if(playerCardValue > 21) {
    //         setIsGameOver(true)
    //     }
    //     playerCardValue > 21 ? console.log("You lost") : console.log("Game still")
        
    // }

    const drawCard = async(num) => {
        try {
            const data = await (
                await fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${num}`)
            ).json()
            const newCards = data.cards
            newCards.forEach(element => {
                setPlayerCards(oldDeck => {
                    return [...oldDeck, element]
                })
                updateCardValue(element.value)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    function updateCardValue(card) {
        const value = isNaN(card) ? 10 : parseInt(card)
        setPlayerCardValue(oldValue => oldValue + value)
    }

    const cardElements = playerCards.map(card => <Card image={card.image} value={card.value} />)

    return (
    <main>
        {game === false ? <button onClick={setupGame}>Start Game</button> : ""}
        <button onClick={() => drawCard(1)}>Hit</button> <br />
        {playerCardValue}
        <div className="player--container">
            {cardElements}
        </div>
    </main>
  )
}
