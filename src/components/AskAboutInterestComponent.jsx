import { useNavigate } from 'react-router';
import { useState } from 'react';
import InterestPlaceTypeCheckBoxComponent from './InterestPlaceTypeCheckBoxComponent.jsx';
import { useEffect } from 'react';

const AskAboutInterestComponent = () => {
    const PLACE_TYPE_MAP = new Map([
        ["交通", [
            "空港",
            "バス停",
            "レンタカー",
            "ガソリンスタンド",
            "駅",
            "駐車場",
            "地下鉄駅",
            "タクシー乗り場",
            "鉄道駅",
            "乗換駅"
          ]],
          ["レジャー", [
            "アミューズメントパーク",
            "水族館",
            "アートギャラリー",
            "ボーリング場",
            "キャンプ場",
            "カジノ",
            "映画館",
            "博物館",
            "ナイトクラブ",
            "アトリエ",
            "公園",
            "RVパーク",
            "スタジアム",
            "観光地",
            "動物園"
          ]],
          ["フード", [
            "パン屋",
            "バー",
            "カフェ",
            "デリバリーサービス",
            "持ち帰り飲食店",
            "レストラン"
          ]],
          ["ショッピング", [
            "書店",
            "自転車屋",
            "カーディーラー",
            "衣料品店",
            "コンビニ",
            "デパート",
            "家電量販店",
            "花屋",
            "家具店",
            "金物店",
            "家庭用品店",
            "宝石店",
            "酒屋",
            "ペットショップ",
            "シューズストア",
            "ショッピングモール",
            "スーパーマーケット"
          ]],
          ["宗教", [
            "墓地",
            "教会",
            "ヒンドゥー教寺院",
            "モスク",
            "シナゴーグ"
          ]],
          ["健康", [
            "ビューティーサロン",
            "歯科医院",
            "医院",
            "薬局",
            "ジム",
            "美容室",
            "病院",
            "処方箋薬局",
            "リハビリテーション",
            "スパ",
            "動物病院"
          ]],
          ["教育", [
            "図書館",
            "小学校",
            "学校",
            "中学校",
            "大学"
          ]],
          ["サービス", [
            "会計事務所",
            "ATM",
            "銀行",
            "自動車修理",
            "洗車",
            "シティホール",
            "電気工務店",
            "葬儀屋",
            "保険代理店",
            "ランドリー",
            "弁護士",
            "鍵屋",
            "宿",
            "レンタルビデオ店",
            "引っ越し業者",
            "配管業者",
            "不動産会社",
            "屋根工事業者",
            "倉庫",
            "旅行代理店"
          ]],
          ["公共サービス", [
            "裁判所",
            "大使館",
            "消防署",
            "行政機関",
            "警察署",
            "郵便局"
          ]]
    ])

    const PLACE_TAG = new Map([
        ["会計", "accounting"],
        ["空港", "airport"],
        ["アミューズメントパーク", "amusement_park"],
        ["水族館", "aquarium"],
        ["アートギャラリー", "art_gallery"],
        ["ATM", "atm"],
        ["パン屋", "bakery"],
        [ "銀行", "bank"],
        ["バー", "bar"],
        ["ビューティーサロン", "beauty_salon"],
        ["自転車屋", "bicycle_store"],
        ["書店", "book_store"],
        ["ボーリング場", "bowling_alley"],
        ["バス停", "bus_station"],
        ["カフェ", "cafe"],
        ["キャンプ場", "campground"],
        ["カーディーラー", "car_dealer"],
        ["レンタカー", "car_rental"],
        ["自動車修理", "car_repair"],
        ["洗車", "car_wash"],
        ["カジノ", "casino"],
        ["墓地", "cemetery"],
        ["教会", "church"],
        ["シティホール", "city_hall"],
        ["衣料品店", "clothing_store"],
        ["コンビニ", "convenience_store"],
        ["裁判所", "courthouse"],
        ["歯科医院", "dentist"],
        ["デパート", "department_store"],
        ["病院", "doctor"],
        ["薬局", "drugstore"],
        ["電気工務店", "electrician"],
        ["家電量販店", "electronics_store"],
        ["大使館", "embassy"],
        ["消防署", "fire_station"],
        ["花屋", "florist"],
        ["葬儀屋", "funeral_home"],
        ["家具店", "furniture_store"],
        ["ガソリンスタンド", "gas_station"],
        ["ジム", "gym"],
        ["美容室", "hair_care"],
        ["金物店", "hardware_store"],
        ["ヒンドゥー教寺院", "hindu_temple"],
        ["家庭用品店", "home_goods_store"],
        ["病院", "hospital"],
        ["保険代理店", "insurance_agency"],
        ["宝石店", "jewelry_store"],
        ["ランドリー", "laundry"],
        ["弁護士", "lawyer"],
        ["図書館", "library"],
        ["駅", "light_rail_station"],
        ["酒屋", "liquor_store"],
        ["行政機関", "local_government_office"],
        ["鍵屋", "locksmith"],
        ["宿", "lodging"],
        ["デリバリーサービス", "meal_delivery"],
        ["持ち帰り飲食店", "meal_takeaway"],
        ["モスク", "mosque"],
        ["レンタルビデオ店", "movie_rental"],
        ["映画館", "movie_theater"],
        ["引っ越し業者", "moving_company"],
        ["博物館", "museum"],
        ["ナイトクラブ", "night_club"],
        ["アトリエ", "painter"],
        ["公園", "park"],
        ["駐車場", "parking"],
        ["ペットショップ", "pet_store"],
        ["処方箋薬局", "pharmacy"],
        ["リハビリテーション", "physiotherapist"],
        ["配管業者", "plumber"],
        ["警察署", "police"],
        ["郵便局", "post_office"],
        ["小学校", "primary_school"],
        ["不動産会社", "real_estate_agency"],
        ["レストラン", "restaurant"],
        ["屋根工事業者", "roofing_contractor"],
        ["RVパーク", "rv_park"],
        ["学校", "school"],
        ["中学校", "secondary_school"],
        ["シューズストア", "shoe_store"],
        ["ショッピングモール", "shopping_mall"],
        ["スパ", "spa"],
        ["スタジアム", "stadium"],
        ["倉庫", "storage"],
        ["店舗", "store"],
        ["地下鉄駅", "subway_station"],
        ["スパーマーケット", "supermarket"],
        ["シナゴーグ", "synagogue"],
        ["タクシー乗り場", "taxi_stand"],
        ["観光地", "tourist_attraction"],
        ["鉄道駅", "train_station"],
        ["乗換駅", "transit_station"],
        ["旅行代理店", "travel_agency"],
        ["大学", "university"],
        ["動物病院", "veterinary_care"],
        ["動物園", "zoo"]
    ]);
    const navigate = useNavigate();

    const [selectedPlaceTags, setSelectedPlaceTags] = useState([]);
    useEffect(() => {
        const placeTypesJson = localStorage.getItem("selectedPlaceType");
        if (placeTypesJson !== null) {
          const placeTypesDict = JSON.parse(placeTypesJson);
          setSelectedPlaceTags(Object.keys(placeTypesDict));
        }
    }, []);

    const handleselectedPlaceTags = (placeTags, checked) => {
        if (checked) {
            let placeTag = placeTags.filter((tag) => (!selectedPlaceTags.includes(tag)))
            setSelectedPlaceTags([...selectedPlaceTags, ...placeTag]);
        } else {
            setSelectedPlaceTags(selectedPlaceTags.filter((tag) => (!placeTags.includes(tag))));
        }
    }

    const onClickForStoreLocalStorage = () => {
        const placeTypesDict = localStorage.getItem("selectedPlaceType");
        if (placeTypesDict !== null) {
            localStorage.removeItem("selectedPlaceType");
        }
        let data = {};
        for (let i = 0; i < selectedPlaceTags.length; i++) {
            data[selectedPlaceTags[i]] = PLACE_TAG.get(selectedPlaceTags[i])
        }

        localStorage.setItem('selectedPlaceType', JSON.stringify(data));
        navigate("/");
    }

    return (
        <>
            <div>
                {[...PLACE_TYPE_MAP.keys()].map((type) => {
                    return (<InterestPlaceTypeCheckBoxComponent key={type}
                        placeType={type}
                        setTag={handleselectedPlaceTags}
                        selectedTags={selectedPlaceTags}
                        tagsInGroup={PLACE_TYPE_MAP.get(type)}/>)
                })}

                <label><input type='button' onClick={onClickForStoreLocalStorage}></input>決定</label>
            </div>
        </>
    );
}

export default AskAboutInterestComponent