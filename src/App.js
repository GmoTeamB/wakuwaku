import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SignIn from "./SignIn";

function Home() {
  return (
    <p>Hello World!!</p>
  );
}

function App() {
  const [account, setAccount] = useState(null);
  const loggedIn = useMemo(() => !!(account && account.accessToken),[account]);

  useEffect(() => {
    console.log("update account");
    console.log(account);
  }, [account]);

  if (loggedIn) {
    return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (<SignIn onSuccess={setAccount}/>);
  }
}

export default App;
