import { LoadScript } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReactDOM from 'react-dom/client';
import { sendCalendar } from "../lib/graph";
import PlaceInfo from "./PlaceInfo";

const MapBase = ({ timeParams, onAddSchedule }) => {
  const facilityTimesDict = {
    "accounting": 60,
    "airport": 120,
    "amusement_park": 180,
    "aquarium": 120,
    "art_gallery": 90,
    "atm": 10,
    "bakery": 20,
    "bank": 30,
    "bar": 120,
    "beauty_salon": 60,
    "bicycle_store": 30,
    "book_store": 60,
    "bowling_alley": 120,
    "bus_station": 30,
    "cafe": 60,
    "campground": 180,
    "car_dealer": 60,
    "car_rental": 60,
    "car_repair": 60,
    "car_wash": 30,
    "casino": 180,
    "cemetery": 30,
    "church": 60,
    "city_hall": 60,
    "clothing_store": 60,
    "convenience_store": 20,
    "courthouse": 60,
    "dentist": 45,
    "department_store": 90,
    "doctor": 45,
    "drugstore": 30,
    "electrician": 60,
    "electronics_store": 60,
    "embassy": 60,
    "fire_station": 20,
    "florist": 30,
    "funeral_home": 30,
    "furniture_store": 60,
    "gas_station": 20,
    "gym": 90,
    "hair_care": 45,
    "hardware_store": 60,
    "hindu_temple": 60,
    "home_goods_store": 60,
    "hospital": 90,
    "insurance_agency": 30,
    "jewelry_store": 30,
    "laundry": 60,
    "lawyer": 60,
    "library": 120,
    "light_rail_station": 30,
    "liquor_store": 30,
    "local_government_office": 60,
    "locksmith": 30,
    "lodging": 180,
    "meal_delivery": 45,
    "meal_takeaway": 45,
    "mosque": 60,
    "movie_rental": 60,
    "movie_theater": 180,
    "moving_company": 60,
    "museum": 120,
    "night_club": 180,
    "painter": 60,
    "park": 120,
    "parking": 30,
    "pet_store": 45,
    "pharmacy": 30,
    "physiotherapist": 45,
    "plumber": 60,
    "police": 30,
    "post_office": 30,
    "primary_school": 180,
    "real_estate_agency": 120,
    "restaurant": 90,
    "roofing_contractor": 60,
    "rv_park": 180,
    "school": 180,
    "secondary_school": 180,
    "shoe_store": 60,
    "shopping_mall": 180,
    "spa": 90,
    "stadium": 180,
    "storage": 60,
    "store": 30,
    "subway_station": 30,
    "supermarket": 60,
    "synagogue": 60,
    "taxi_stand": 20,
    "tourist_attraction": 120,
    "train_station": 30,
    "transit_station": 30,
    "travel_agency": 60,
    "university": 180,
    "veterinary_care": 45,
    "zoo": 180
  };
  const [placeType, setPlaceType] = useState();
  const [selectedButton, setSelectedButton] = useState(null);
  //ユーザーが選択したプレイスタイプの辞書をlocalStorageから取得
  const placeTypesJson = localStorage.getItem("selectedPlaceType")
  const placeTypesDict = JSON.parse(placeTypesJson);
  const keys = Object.keys(placeTypesDict);
  const handleSelectType = (key) => {
    setPlaceType(placeTypesDict[key]);
    setSelectedButton(key);
  };

  const addSchedule = async (place) => {
    if (!place) {
      alert("予定を追加する場所を選択してください。");
      return;
    }
    if (window.confirm("予定を追加しますか？")) {
      if (timeParams) {
        const response = await sendCalendar(place.name, timeParams.startTime, timeParams.freetime, facilityTimesDict[placeType]);
        console.log(facilityTimesDict[placeType])
        onAddSchedule(response);
      } else {
        alert("予定を入れる時間がありません")
      }
    }
  };

  useEffect(() => {
    const successCallback = (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const currentLocation = new window.google.maps.LatLng(lat, lng);
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: currentLocation,
        zoom: 17,
        mapTypeControl: false,
        panControl: false,
        scaleControl: false,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
			//現在地のマーカーを作成
			const currentLocationMarkerIcon = {
      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      scaledSize: new window.google.maps.Size(40, 40),
    };
      new window.google.maps.Marker({
        position: currentLocation,
        map: map,
				title: "現在地",
				icon: currentLocationMarkerIcon
      });

      const request = {
        location: currentLocation,
        radius: 200,
        types: [placeType],
      };
			//現在地から一定範囲のtypeに合致する施設にマーカーを立てる
      const service = new window.google.maps.places.PlacesService(map);
      if (placeType) {
        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          }
        });
      }
			//クリックしたら施設情報が表示されるマーカーの作成
			const markersWithInfowindows = [];
      const createMarker = (place) => {
        const placeLocation = place.geometry.location;
        const marker = new window.google.maps.Marker({
          map: map,
          position: placeLocation,
          title: place.name,
        });

        const infowindow = new window.google.maps.InfoWindow();
				marker.addListener("click", () => {
					markersWithInfowindows.forEach((entry) => {
						entry.infowindow.close()
					});
          const service = new window.google.maps.places.PlacesService(map);
          service.getDetails(
            {
              placeId: place.place_id,
            },
            (result, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const element = document.createElement("div");
                ReactDOM.createRoot(element).render(<PlaceInfo place={result} addSchedule={addSchedule}></PlaceInfo>);

                infowindow.setContent(element);
								infowindow.open(map, marker);
								markersWithInfowindows.push({
                    marker: marker,
                    infowindow: infowindow,
                });
              }
            }
          );
        });
      };
    };

    const errorCallback = (error) => {
      alert("位置情報が取得できませんでした。\n位置情報の取得が許可されているか確認してください。");
    };
		//現在位置の取得
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, [placeType]);

	return (
    <div id="parent-container" style={{
      display: "flex",
      flexDirection: "column",
      position: "relative",
      height: "680px",
      width: "95%",
      margin: "auto",
      marginTop: "20px",
      top: "0",
      right: "0",
      bottom: "0",
      left: "0"
    }}>
      <div style={{ position: "absolute", zIndex: 1 }}>
        <nav style={{
          display: "flex",
          listStyle: "none",
          margin: "1em",
        }}>
          {keys.map((key, index) => {
            let style = {
              color: "#000000",
              border: "none",
              marginRight: index < keys.length ? "10px" : "0",
              boxSizing: "border-box",
              padding: "0.2em 1em",
              boxShadow: "2px 2px 4px 0 gray",
            };
            if (selectedButton == key) {
              style.backgroundColor = "#d3e5ff";
              style.border = "3px solid #428dff";
            } else {
              style.backgroundColor = "#ffffff";
            }
            return (
              <Button
                style={style}
                key={key} onClick={() => handleSelectType(key)}>
                {key}
              </Button>
            );
          })}
        </nav>
      </div>
      <div id="map" style={{ flex: 1, width: "100%", border: "1px solid #808080", borderRadius: "20px" }} />
		</div>
	);
};

const GoogleMap = ({timeParams, onAddSchedule}) => {
  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY} libraries={["places"]}>
        <MapBase timeParams={timeParams} onAddSchedule={onAddSchedule}/>
      </LoadScript>
    </div>
  )
}

export default GoogleMap;
