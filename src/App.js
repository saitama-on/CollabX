import logo from './logo.svg';
import './App.css';
import DisplayArea from './components/displayArea';
import info from './info1.json'
import SearchBar from './components/searchBar'


function App() {
  return (
    <div>
      <SearchBar jsonData={info}/>
      {/* <DisplayArea info_json={info}/> */}
    </div>
    
  );
}

export default App;
