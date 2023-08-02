import React, { useEffect, useState } from "react";

const GoogleMap = () => {
  const [placeType, setPlaceType] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  //最終的にはユーザーが選択したタイプの辞書をlocalStorageから取得
  const typesDict = {
    映画館: "movie_theater",
    飲食店: "restaurant",
    カフェ: "cafe",
    博物館: "museum",
    美容室: "beauty_salon"
  }
  const keys = Object.keys(typesDict);
  const handleSelectType = (key) => {
    setPlaceType(typesDict[key]);
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
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
			});
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
                infowindow.setContent(`
                  <h3>${result.name}</h3>
                  <a href=${result.url}>${result.formatted_address}</a>
                  <p>評価：${result.rating ? result.rating + " / 5" : "評価情報なし"}</p>
                  <p>電話番号：${result.formatted_phone_number ? '<a href=tel:' + result.formatted_phone_number + '>' + result.formatted_phone_number + '</a>' : "電話番号なし"}</p>
									<ul style=list-style:none>
										${result.current_opening_hours?.weekday_text?.slice(0, 7).map((item, index) => `
											<li key=${index}>${item}</li>
										`).join('') || "情報なし"}
									</ul>
                  <p>WEBサイト：${result.website ? '<a href=' + result.website + '>' + result.website + '</a>' : "情報なし"}</p>
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

	return (
    <div id="parent-container" style={{
      height: "550px",
      width: "90%",
      position: "absolute",
      margin: "auto",
      top: "0",
      right: "0",
      bottom: "0",
      left: "0"
    }}>
      <div style={{ display: "flex" }}>
        {keys.map((key) => (
          <button
            style={{
            height: "40px",
            backgroundColor: selectedButton === key ? "#87ceeb" : "transparent",
            }}
            key={key} onClick={() => handleSelectType(key)}>
            {key}
          </button>
        ))}
      </div>
      <div id="map" style={{ height: "100%", width: "100%", border: "1px solid #000" }} />
		</div>
	);
};

export default GoogleMap;
