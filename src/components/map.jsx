import { LoadScript } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReactDOM from 'react-dom/client';
import { sendCalendar } from "../lib/graph";
import PlaceInfo from "./PlaceInfo";

const MapBase = ({ timeParams, onAddSchedule }) => {
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
        const response = await sendCalendar(place.name, timeParams.startTime, timeParams.freetime);
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
