import { Form } from "react-bootstrap";

const InterestPlaceCheckBoxComponent = (props) => {
    const { placeTag, checked, setValue } = props;

    const handleChangeState = (event) => {
        let selectedPlaceTag = event.target.value;
        setValue([selectedPlaceTag], event.target.checked);
    } 

    const id = `interest-place-type-checkbox-component-checkbox-${placeTag}`;

    return (
        <Form.Check
            id={id}
            label={placeTag}
            onChange={handleChangeState}
            value={placeTag}
            checked={checked}
            style={{ display: "inline-block" }}
        ></Form.Check>
    ); 
} 

export default InterestPlaceCheckBoxComponent