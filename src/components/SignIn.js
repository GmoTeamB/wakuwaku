import Button from 'react-bootstrap/Button';
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { signIn } from "../lib/login";
import { msalConfig, loginRequest, scopes, tokenRequest } from "../config";

const divStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: "3em",
    boxSizing: "border-box"
};
const pStyle = {
    fontSize: "4em",
    margin: "1em 0",
};
const btnStyle = {
    height: "min-content"
};
const AsideStyle = {
    color: "gray",
    fontSize: "0.8em",
    margin: "1em 0",
};

function SignIn(props) {

    const myMSALObj = new PublicClientApplication(msalConfig);
    myMSALObj.initialize();
    async function btnClick() {
        const account = await signIn(myMSALObj);

        if (!account) {
            if (props && props.onFail) {
                props.onFail();
            } else {
                console.error("failed to signin");
            }
            return;
        }

        if (props && props.onSuccess) {
            props.onSuccess(account);
        } else {
            console.log(account);
        }

        if (props.redirect) {
            window.history.pushState("", "", props.redirect);
        } else {
            window.history.pushState("", "", "/select");
        }
    }

    return (
        <div style={divStyle}>
            <p style={pStyle}>わくわく休み時間</p>
            <Button id="sign_in" onClick={btnClick} style={btnStyle} variant="primary">サインイン</Button>
            <aside style={AsideStyle}>Microsoftアカウントでサインインします。</aside>
        </div>
    );
}

export default SignIn;
