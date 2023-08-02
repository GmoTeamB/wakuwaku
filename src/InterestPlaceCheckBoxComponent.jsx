const InterestPlaceCheckBoxComponent = (props) => {

    const handleChangeState = (event) => {
        if (event.target.checked) {
        var selectedPlaceTag = event.target.value;
        props.setValue(selectedPlaceTag);
        }
    } 

    return (
        <>
            <label>{props.placeTag}</label>
            <input type="checkbox" onChange={handleChangeState} value={props.placeTag} ></input>
        </>
    ); 
} 

export default InterestPlaceCheckBoxComponent