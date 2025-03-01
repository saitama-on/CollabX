import logo from './logo.svg';
import './App.css';

import info from './info1.json'
import SearchBar from './components/searchBar'


function App() {
  return (
    <div>
      <SearchBar jsonData={info}/>
      
    </div>
    
  );
}

export default App;
