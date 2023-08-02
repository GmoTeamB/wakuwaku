import Calendar from "../Calendar/Calendar";
import GoogleMap from "./map";

const divStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 3fr"
};

function Home(props) {
    const { account } = props;

    return (
        <div style={divStyle}>
            <Calendar account={account} />
            <GoogleMap/>
        </div>
    )
}

export default Home;