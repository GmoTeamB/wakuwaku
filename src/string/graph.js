/** 
 * Helper function to call MS Graph API endpoint
 * using the authorization bearer token scheme
*/
function callMSGraph(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}

function callMSGraphPost(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    let body = {   
        "Schedules": ["zelda09877890@gmail.com"],     
        "StartTime": {
            "dateTime": "2023-07-31T09:00:00",
            "timeZone": "Tokyo Standard Time"
        },
        "EndTime": {
            "dateTime": "2023-08-01T22:00:00",
            "timeZone": "Tokyo Standard Time"
        },
        "availabilityViewInterval": "15"
    }

    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json"); // コンテンツタイプをJSONに設定
    headers.append("Prefer", "outlook.timezone=\"Tokyo Standard Time\""); // Prefer ヘッダーを追加

    console.log("%o",JSON.stringify(body))

    const options = {
        method: "Post",
        headers: headers,
        body: JSON.stringify(body) // JSON形式のデータ
    };

    console.log('request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}