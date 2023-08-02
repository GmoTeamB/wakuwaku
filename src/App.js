import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SignIn from "./components/SignIn";
import GoogleMap from "./components/map";
import Calendar from "./Calendar/Calendar";
import './App.css';
import { readCalendar } from "./lib/graph";

function Home() {
  async function onClick() {
    const data = await readCalendar();
    console.log(data);
  }

  return (
    <>
      <p>Hello World!!</p>
      <button onClick={onClick}>get calendar</button>
    </>
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
            <Route path="/calendar" element={<Calendar account={account}/>}/>
            <Route path="/map" element={<GoogleMap/>} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (<SignIn onSuccess={setAccount}/>);
  }
}

export default App;