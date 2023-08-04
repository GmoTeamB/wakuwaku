import { InteractionType, InteractionRequiredAuthError } from "@azure/msal-browser";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Client } from "@microsoft/microsoft-graph-client";
import { username } from "./login";
import { myMSALObj } from "../components/SignIn";
import { tokenRequest, graphConfig } from "../config";

function getTokenPopup(request) {
    request.account = myMSALObj.getAccountByUsername(username);
    
    return myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.warn("silent token acquisition fails. acquiring token using popup");
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return myMSALObj.acquireTokenPopup(request)
                    .then(tokenResponse => {
                        console.log(tokenResponse);
                        return tokenResponse;
                    }).catch(error => {
                        console.error(error);
                    });
            } else {
                console.warn(error);   
            }
    });
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  
function formatDateTime(dateTime) {
    const year = dateTime.getFullYear();
    const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
    const day = ('0' + dateTime.getDate()).slice(-2);
    const hours = ('0' + dateTime.getHours()).slice(-2);
    const minutes = ('0' + dateTime.getMinutes()).slice(-2);
    const seconds = ('0' + dateTime.getSeconds()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
async function callMSGraphPostSendCalendar(endpoint, token,title,startTime,freetime) {
    console.log("aaaaaa")
    console.log(startTime)
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    const originalDateTime = new Date(startTime);
    const newDateTime = addMinutes(originalDateTime, freetime);

    const formattedNewDateTime = formatDateTime(newDateTime);
    console.log(formattedNewDateTime);

    
    let body =
        {
            "subject": title,
            "start": {
              "dateTime": startTime,
              "timeZone": "Tokyo Standard Time"
            },
            "end": {
              "dateTime": formattedNewDateTime,
              "timeZone": "Tokyo Standard Time"
            },
            // "location": {
            //   "displayName": "会議室A"
            // }
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
    return fetch(endpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function sendCalendar(title,StartTime,freetime){
    const response = await getTokenPopup(tokenRequest);
    const result = await callMSGraphPostSendCalendar(graphConfig.graphCalendarSendEndpoint, response.accessToken,title,StartTime,freetime);
    return result;
}

export function getGraphClient(account) {
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(myMSALObj, {
        account, // the AccountInfo instance to acquire the token for
        scopes: tokenRequest.scopes,
        interactionType: InteractionType.Popup,
    });
    let clientOptions = {
        authProvider
    };

    const graphClient = Client.initWithMiddleware(clientOptions);

    return graphClient;
}

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

function callMSGraphPost(endpoint, token, callback,email) {
    const headers = new Headers();
    const now = new Date();

    // 必要な形式に日付を整形
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T`;

    console.log(formattedDate);
    const bearer = `Bearer ${token}`;
    let body = {
        "Schedules": [email],
        "StartTime": {
            "dateTime": formattedDate + "00:00:00",
            "timeZone": "Tokyo Standard Time"
        },
        "EndTime": {
            "dateTime": formattedDate + "23:59:59",
            "timeZone": "Tokyo Standard Time"
        },
        "availabilityViewInterval": "5"
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

export async function readCalendar(email) {
    const promise = new Promise((resolve, reject) => {
        getTokenPopup(tokenRequest)
            .then(response => {
                callMSGraphPost(graphConfig.graphCalendarEndpoint, response.accessToken, resolve,email);
            }).catch(error => {
                console.error(error);
            });
    });
    return promise;
}
