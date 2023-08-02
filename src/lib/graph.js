import { InteractionType, InteractionRequiredAuthError } from "@azure/msal-browser";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Client } from "@microsoft/microsoft-graph-client";
import { myMSALObj, username } from "./login";
import { tokenRequest } from "./config";

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
