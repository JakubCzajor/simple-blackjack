export default function Card(props) {

    return (
        <div className="player--card">
            <img src={props.image} alt="" />
            <h4>{props.value}</h4>
        </div>
    )
}