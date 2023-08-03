const InterestPlaceCheckBoxComponent = (props) => {
    const { placeTag, checked, setValue } = props;

    const handleChangeState = (event) => {
        let selectedPlaceTag = event.target.value;
        setValue(selectedPlaceTag, event.target.checked);
    } 

    return (
        <>
            <label>{placeTag}</label>
            <input type="checkbox" onChange={handleChangeState} value={placeTag} defaultChecked={checked}></input>
        </>
    ); 
} 

export default InterestPlaceCheckBoxComponent