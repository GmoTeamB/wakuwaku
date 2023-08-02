import { Routes, Route } from "react-router";
import './App.css';

function Home() {
  return (
    <p>Hello World!!</p>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>
  );
}

export default App;
