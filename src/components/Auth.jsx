import { useEffect, useMemo, useState } from "react";
import SignIn from "./SignIn";
import App from "../App";
import { refreshToken } from "../lib/login";

function Auth() {
    const [account, setAccount] = useState(null);
    const loggedIn = useMemo(() => !!(account && account.accessToken), [account]);

    useEffect(() => {
        console.log("update account");
        if (loggedIn) {
            setTimeout(async () => {
                const accessToken = await refreshToken(account);
                setAccount({ ...account, accessToken });
            }, 5*1000);
        }
    }, [account]);

    if (loggedIn) {
        return (<App account={account}/>);
    } else {
        if (window.location.pathname !== "/signin") {
            window.history.pushState("", "", "/signin");
        } else {
            return (<SignIn onSuccess={setAccount} redirect="/select"/>);
        }
    }
}

export default Auth;