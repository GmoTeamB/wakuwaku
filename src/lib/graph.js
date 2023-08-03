import { InteractionType, InteractionRequiredAuthError } from "@azure/msal-browser";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Client } from "@microsoft/microsoft-graph-client";
import { myMSALObj, username } from "./login";
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

function callMSGraphPostSendCalendar(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    let body =
        {
            "subject": "ミーティングのタイトル",
            "start": {
              "dateTime": "2023-08-02T10:00:00",
              "timeZone": "Tokyo Standard Time"
            },
            "end": {
              "dateTime": "2023-08-02T11:00:00",
              "timeZone": "Tokyo Standard Time"
            },
            "location": {
              "displayName": "会議室A"
            }
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

export async function sendCalendar(){
    await new Promise((resolve, reject) => {
        getTokenPopup(tokenRequest)
            .then(response => {
                callMSGraphPostSendCalendar(graphConfig.graphCalendarSendEndpoint, response.accessToken, resolve);
            }).catch(error => {
                console.error(error);
            });
        });
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

function callMSGraphPost(endpoint, token, callback) {
    const headers = new Headers();
    const now = new Date();

    // 必要な形式に日付を整形
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T`;

    console.log(formattedDate);
    const bearer = `Bearer ${token}`;
    let body = {
        "Schedules": ["zelda09877890@gmail.com"],
        "StartTime": {
            "dateTime": formattedDate + "00:00:00",
            "timeZone": "Tokyo Standard Time"
        },
        "EndTime": {
            "dateTime": formattedDate + "23:59:59",
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

export async function readCalendar() {
    const promise = new Promise((resolve, reject) => {
        getTokenPopup(tokenRequest)
            .then(response => {
                callMSGraphPost(graphConfig.graphCalendarEndpoint, response.accessToken, resolve);
            }).catch(error => {
                console.error(error);
            });
    });
    return promise;
}
