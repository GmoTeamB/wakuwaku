import { Route, Routes } from "react-router";
import './App.css';
import AskAboutInterestComponent from "./components/AskAboutInterestComponent";
import GoogleMap from "./components/map";

function Home() {
  return (
    <p>Hello World!!</p>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select" element={<AskAboutInterestComponent />} />
        <Route path="/map" element={<GoogleMap/>} />
      </Routes>
    </>
  );
}

export default App;