import { useEffect, useMemo, useState } from "react";
import SignIn from "./SignIn";
import App from "../App";

function Auth() {
    const [account, setAccount] = useState(null);
    const loggedIn = useMemo(() => !!(account && account.accessToken),[account]);

    useEffect(() => {
        console.log("update account");
        console.log(account);
    }, [account]);

    if (loggedIn) {
        return (<App account={account}/>);
    } else {
        if (window.location.pathname !== "/signin") {
            window.history.pushState("", "", "/signin");
        } else {
            return (<SignIn onSuccess={setAccount} redirect="/"/>);
        }
    }
}

export default Auth;