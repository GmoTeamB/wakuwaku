import { LogLevel } from "@azure/msal-browser";
/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */

const auth_ms = {
    clientId: "9c83c894-5da4-4176-8364-361969ac314a",
    authority: "https://login.microsoftonline.com/c210b6f6-c011-4de4-a088-256a53856014",
    redirectUri: "http://localhost:3000/",
}
const auth_app = {
    clientId: "ef1af11b-93db-4759-86dc-2406d18515d6",
    authority: "https://login.microsoftonline.com/c210b6f6-c011-4de4-a088-256a53856014",
    redirectUri: "http://localhost:3000/",
};
const auth_app2 = {
    clientId: "43cbb628-b8f8-4e22-b91b-430c37b7d0dc",
    authority: "https://login.microsoftonline.com/c210b6f6-c011-4de4-a088-256a53856014",
    redirectUri: "http://localhost:3000/",
};

export const msalConfig = {
    auth: auth_ms,
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {		
                    case LogLevel.Error:		
                        console.error(message);		
                        return;		
                    case LogLevel.Info:		
                        console.info(message);		
                        return;		
                    case LogLevel.Verbose:		
                        console.debug(message);		
                        return;		
                    case LogLevel.Warning:		
                        console.warn(message);		
                        return;		
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["User.Read"]
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const tokenRequest = {
    scopes: ["User.Read", "Mail.Read", "Calendars.Read"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};

export const scopes = ["User.Read", "Mail.Read", "Calendars.Read"];

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
};
