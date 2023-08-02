import GoogleMap from "./map";
import Calendar from "../Calendar/Calendar";

const divStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
};

function Home(props) {
    const { account } = props;

    return (
        <div style={divStyle}>
            <GoogleMap/>
            <Calendar account={account}/>
        </div>
    )
}

export default Home;