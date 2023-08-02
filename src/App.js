import { LoadScript } from "@react-google-maps/api";
import './App.css';
import GoogleMap from './components/map';

function App() {
  return (
    <div className="App">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY} libraries={["places"]}>
        <GoogleMap />
      </LoadScript>
    </div>
  );
}

export default App;
