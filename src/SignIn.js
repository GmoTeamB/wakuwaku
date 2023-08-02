//import './App.css';
import { signIn } from "./login";

const divStyle = {
    display: "flex",
    justifyContents: "center",
    textAlign: "end",
    width: "100%",
    height: "100%",
    margin: "5em"
};

function SignIn() {
  return (
    <div style={divStyle}>
      <button id="sign_in" onClick={signIn}>Sign In</button>
    </div>
  );
}

export default App;
