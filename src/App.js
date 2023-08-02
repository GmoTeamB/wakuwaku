import { Routes, Route } from "react-router";
import Calendar from "./Calendar/Calendar";
function Home() {
  return (
    <p>Hello World!!</p>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Calendar/>}/>
    </Routes>
  );
}

export default App;
