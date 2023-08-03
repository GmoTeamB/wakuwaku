import Button from 'react-bootstrap/Button';
import { signIn } from "../lib/login";

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
    async function btnClick() {
        const account = await signIn();

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
