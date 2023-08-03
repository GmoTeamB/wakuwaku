import Calendar from "../Calendar/Calendar";
import GoogleMap from "./map";
import { useState } from "react";

const divStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 3fr"
};

function Home(props) {
    const { account } = props;
    const [timeParams, setTimeParams] = useState(null);

    return (
        <div style={divStyle}>
            <Calendar account={account} setTimeParams={setTimeParams} />
            <GoogleMap timeParams={timeParams}/>
        </div>
    )
}

export default Home;