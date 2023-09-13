import { useState, useEffect } from 'react'
import Card from "./components/Card"

export default function App() {

    const [deck, setDeck] = useState({})
    const [playerCards, setPlayerCards] = useState([{}])
    const [playerCardValue, setPlayerCardValue] = useState(0)

    useEffect(() => {
        fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(res => res.json())
        .then(data => setDeck(data))
    }, [])


    const drawCard = async() => {
        try {
            const data = await (await fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`)).json()
            setPlayerCards(oldDeck => {
                return [...oldDeck, data.cards[0]]
            })
            setPlayerCardValue(oldValue => oldValue + parseInt(data.cards[0].value))
        } catch (err) {
            console.log(err.message)
        }
    }

    function updateCardValue(card) {
        
    }

    const cardElements = playerCards.map(card => <Card image={card.image} value={card.value} />)

    return (
    <main>
        <button onClick={drawCard}>Hit</button>
        {playerCardValue}
        <div className="player--container">
            {cardElements}
        </div>
    </main>
  )
}
