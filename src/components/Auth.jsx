import { useEffect, useMemo, useState } from "react";
import SignIn from "./SignIn";
import App from "../App";
import { refreshToken } from "../lib/login";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig, loginRequest, scopes, tokenRequest } from "../config";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10min

function Auth() {

    if (window.location.hash.includes("id_token")) {
        new PublicClientApplication(msalConfig);
    }

    const [account, setAccount] = useState(null);
    const loggedIn = useMemo(() => !!(account && account.accessToken), [account]);

    useEffect(() => {
        console.log("update account");
        if (loggedIn) {
            setTimeout(async () => {
                const accessToken = await refreshToken(account);
                setAccount({ ...account, accessToken });
            }, REFRESH_INTERVAL_MS);
        }
    }, [account]);

    if (loggedIn) {
        return (<App account={account}/>);
    } else {
        if (window.location.pathname !== "/signin") {
            window.history.pushState("", "", "/signin");
            return (<SignIn onSuccess={setAccount} redirect="/select"/>);
        } else {
            return (<SignIn onSuccess={setAccount} redirect="/select"/>);
        }
    }
}

export default Auth;