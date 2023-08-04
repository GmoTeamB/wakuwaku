import { Form } from "react-bootstrap";
import InterestPlaceCheckBoxComponent from "./InterestPlaceCheckBoxComponent";

const CheckboxStyle = {
    fontSize: "2em",
    height: "2em",
};
const UlStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    listStyle: "none",
    padding: 0,
};
const LiStyle = {
    display: "inline-block",
    width: "10em",
};

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

    const id = `interest-place-type-checkbox-component-checkbox-${placeType}`;

    return (
        <div style={{ textAlign: "start" }}>
            <Form.Check
                id={id}
                label={placeType}
                checked={isChecked(selectedTags)}
                onChange={allCheckToggle}
                style={CheckboxStyle}
            ></Form.Check>

            <ul style={UlStyle}>
                {tagsInGroup.map((tag) => (
                    <li key={tag} style={LiStyle}>
                        <InterestPlaceCheckBoxComponent
                            placeTag={tag}
                            checked={selectedTags.includes(tag)}
                            setValue={setTag}/>
                    </li>
                ))}
            </ul>
        </div>
    )

}
export default InterestPlaceTypeCheckBoxComponent