import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
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

  return (
    <Routes>
        <Route path="/" element={ loggedIn ? <Home /> : <Navigate replace to="/signin"/>}/>
        <Route path="/signin" element={<SignIn onSuccess={setAccount}/>}/>
    </Routes>
  );
}

export default App;
