import InterestPlaceCheckBoxComponent from "./InterestPlaceCheckBoxComponent";

const InterestPlaceTypeCheckBoxComponent = (props) => {
    const {placeType, setTag, selectedTags, tagsInGroup} = props;

    const isChecked = (selectedPlaceTags) => {
        let selectedTagsInGroup = selectedPlaceTags.filter((tag) => (tagsInGroup.includes(tag)));

        if (selectedTagsInGroup.length === tagsInGroup.length) {
            return true
        } else {
            return false
        }
    }

    const allCheckToggle = (event) => {
        setTag(tagsInGroup, event.target.checked)
        //console.log(selectedTags);
    }

    return (
        <>
        <input type='checkbox' checked={isChecked(selectedTags)} onClick={allCheckToggle}></input><label>{placeType}</label>

        {tagsInGroup.map((tag) => {
            return(
            <InterestPlaceCheckBoxComponent key={tag}
            placeTag={tag}
            checked={selectedTags.includes(tag)}
            setValue={setTag}/>
        )})}
        </>
    )

}
export default InterestPlaceTypeCheckBoxComponent