import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Calendar from "./Calendar/Calendar";
import AskAboutInterestComponent from "./components/AskAboutInterestComponent";
import GoogleMap from "./components/map";
import Home from "./components/Home";

function App(props) {
  const { account } = props;

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
}

export default App;