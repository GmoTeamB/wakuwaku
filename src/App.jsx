import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Calendar from "./Calendar/Calendar";
import AskAboutInterestComponent from "./components/AskAboutInterestComponent";
import SignIn from "./components/SignIn";
import GoogleMap from "./components/map";
import Home from "./components/Home";

function App() {
  const [account, setAccount] = useState(null);
  const loggedIn = useMemo(() => !!(account && account.accessToken),[account]);

  useEffect(() => {
    console.log("update account");
    console.log(account);
  }, [account]);

  // TODO: delete this
  if (window.location.pathname == "/map") {
    return (<GoogleMap/>);
  }

  if (loggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home account={account}/>}/>
          <Route path="/calendar" element={<Calendar account={account} />} />
          <Route path="/select" element={<AskAboutInterestComponent />} />
          <Route path="/map" element={<GoogleMap/>} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (<SignIn onSuccess={setAccount}/>);
  }
}

export default App;