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
    const [response, setResponse] = useState(null);

    function onAddSchedule(response) {
        setResponse(response);
    }
    return (
        <div style={divStyle}>
            <Calendar account={account} response={response} setTimeParams={setTimeParams} />
            <GoogleMap timeParams={timeParams} onAddSchedule={onAddSchedule}/>
        </div>
    )
}

export default Home;