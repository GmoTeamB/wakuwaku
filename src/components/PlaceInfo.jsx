import { Button } from "react-bootstrap";

function PlaceInfo({ place, addSchedule }) {
    const rating = place.rating ? `${place.rating} / 5` : "評価情報なし";
    const phone = place.formatted_phone_number ? (
            <a href="tel:' + result.formatted_phone_number">{place.formatted_phone_number}</a>
        ) : "電話番号なし";
    const web = place.website ? (
            <a href={place.website}>{place.website}</a>
        ) : "情報なし";
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ textAlign: "center" }}>
                <p><b>{place.name}</b></p>
                <a href={place.url}>{place.formatted_address}</a>
                <p>評価：{rating}</p>
                <p>電話番号：{phone}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {place.current_opening_hours?.weekday_text?.slice(0, 7).map((item, index) => (
                            <li key={index}>{item}</li>
                        )) || "情報なし"}
                </ul>
                <p>WEBサイト：{web}</p>
            </div>
            <Button onClick={() => addSchedule(place)}>予定を追加</Button>
        </div>
    )
}

export default PlaceInfo;