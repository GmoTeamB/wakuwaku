import { LoadScript } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { sendCalendar } from "../lib/graph";
const MapBase = ({ timeParams, onAddSchedule }) => {
  const [placeType, setPlaceType] = useState();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState();
  //ユーザーが選択したプレイスタイプの辞書をlocalStorageから取得
  const placeTypesJson = localStorage.getItem("selectedPlaceType")
  const placeTypesDict = JSON.parse(placeTypesJson);
  const keys = Object.keys(placeTypesDict);
  const handleSelectType = (key) => {
    setPlaceType(placeTypesDict[key]);
    setSelectedButton(key);
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
              setSelectedPlace(result)
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                infowindow.setContent(`
                  <div style="text-align: center;">
                    <p><b>${result.name}</b></p>
                    <a href=${result.url}>${result.formatted_address}</a>
                    <p>評価：${result.rating ? result.rating + " / 5" : "評価情報なし"}</p>
                    <p>電話番号：${result.formatted_phone_number ? '<a href=tel:' + result.formatted_phone_number + '>' + result.formatted_phone_number + '</a>' : "電話番号なし"}</p>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                      ${result.current_opening_hours?.weekday_text?.slice(0, 7).map((item, index) => `
                        <li key=${index}>${item}</li>
                      `).join('') || "情報なし"}
                    </ul>
                    <p>WEBサイト：${result.website ? '<a href=' + result.website + '>' + result.website + '</a>' : "情報なし"}</p>
                  </div>
                `);
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
  const addSchedule = async () => {
          if (!selectedPlace) {
            alert("予定を追加する場所を選択してください。");
            return;
          }
          if (window.confirm("予定を追加しますか？")) {
            if (timeParams) {
              const response = await sendCalendar(selectedPlace.name, timeParams.startTime, timeParams.freetime);
              onAddSchedule(response);
            } else {
              alert("予定を入れる時間がありません")

            }
          }
        };

	return (
    <div id="parent-container" style={{
      display: "flex",
      flexDirection: "column",
      height: "650px",
      width: "90%",
      margin: "auto",
      top: "0",
      right: "0",
      bottom: "0",
      left: "0"
    }}>
      <div style={{ position: "absolute", zIndex: 1 }}>
        <ul style={{ display: "flex", listStyle: "none" }}>
          {keys.map((key) => (
            <li key={key} style={{ backgroundColor: "white" }}>
              <button
                style={{
                height: "40px",
                backgroundColor: selectedButton === key ? "#87ceeb" : "transparent",
                }}
                onClick={() => handleSelectType(key)}>
                {key}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="map" style={{ flex: 1, width: "100%", border: "1px solid #000" }} />
      <div style={{textAlign: "right"}}>
        <button style={{ height: "40px", marginTop: "10px"}} onClick={() => addSchedule()}>予定を追加</button>
      </div>
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
