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
    fontSize: "2em"
};
const btnStyle = {
    height: "min-content"
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
            window.history.pushState("", "", "/");
        }
    }

    return (
        <div style={divStyle}>
            <p style={pStyle}>わくわく休み時間</p>
            <button id="sign_in" onClick={btnClick} style={btnStyle}>Sign In</button>
        </div>
    );
}

export default SignIn;
