import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig, loginRequest, scopes, tokenRequest } from "../config";

export const myMSALObj = new PublicClientApplication(msalConfig);

export let username = "";

function debug(msg) {
    console.log(msg);
}

function selectAccount() {

    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts.length === 0) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add choose account code here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username;
        debug(username);
    }
}

export function getAccount() {
    return myMSALObj.getAccountByUsername(username);
}

function handleResponse(response) {

    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */

    if (response !== null) {
        username = response.account.username;
        debug(username);
    } else {
        selectAccount();
    }
}

export async function signIn() {
    const res = await myMSALObj.loginPopup({ scopes });
    handleResponse(res);

    const account = res?.account;

    if (account) {
        const token = await getTokenPopup(account, tokenRequest);
        account.accessToken = token;
    }
    return account;
}

async function signOut() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username),
        postLogoutRedirectUri: msalConfig.auth.redirectUri,
        mainWindowRedirectUri: msalConfig.auth.redirectUri
    };

    await myMSALObj.logoutPopup(logoutRequest);
}

async function getTokenPopup(account, request) {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    request.account = account;
    
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

export async function refreshToken(account) {
    const request = { ...tokenRequest, account };
    return myMSALObj.acquireTokenSilent(request).catch(() => null);
}
