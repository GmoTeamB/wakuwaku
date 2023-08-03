const InterestPlaceCheckBoxComponent = (props) => {
    const { placeTag, checked, setValue } = props;

    const handleChangeState = (event) => {
        let selectedPlaceTag = event.target.value;
        setValue([selectedPlaceTag], event.target.checked);
    } 

    return (
        <>
            <input type="checkbox" onChange={handleChangeState} value={placeTag} checked={checked}></input>
            <label>{placeTag}</label>
        </>
    ); 
} 

export default InterestPlaceCheckBoxComponent