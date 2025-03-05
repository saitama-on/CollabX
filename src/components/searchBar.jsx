import React from 'react'
import '../styles/searchBar.css'
import { useState, useEffect } from 'react'
import InfoModal from "./modal.jsx"
import InputModal from "./inputmodal.jsx"
import { initializeApp } from "firebase/app";
import { ref, getStorage, uploadBytes, getDownloadURL, list } from 'firebase/storage';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useFormState } from "react-dom";
import { ThreeDot } from 'react-loading-indicators';

const firebaseConfig = {
  apiKey: "AIzaSyD2RpxeHhLOMaqzS8-Vo5WuUqLtUFYilUE",
  authDomain: "sensor-proj-b3fdb.firebaseapp.com",
  projectId: "sensor-proj-b3fdb",
  storageBucket: "sensor-proj-b3fdb.appspot.com",
  messagingSenderId: "603026668192",
  appId: "1:603026668192:web:f6eceb438b31e2b60567c5"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function SearchBar() {
  const [show, setShow] = useState(false)
  const [data, setData] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const [faculty, setFaculty] = useState('ALL')  // Faculty state
  const [inputshow, setInputShow] = useState(false);
  const [jsonData, setJsonData] = useState({});
  const[facultyJson , setFacultyJson] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [facultyArray , setFacultyArray] = useState(["ALL"]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoUrl = await getDownloadURL(ref(storage, 'student/info1.json'));
        const fac_url = await getDownloadURL(ref(storage , 'student/faculty.json'));
        const fac_res = await fetch(`https://cors-anywhere-wbl8.onrender.com/${fac_url}`);
        const fac_data = await fac_res.json();
        setFacultyJson(fac_data);
        const response = await fetch(`https://cors-anywhere-wbl8.onrender.com/${infoUrl}`);
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    };
    fetchData();
},[])

     

  // Filter data by searchQuery, category, and faculty
  useEffect(() => {
    let filteredData = Object.values(jsonData).filter((item) => {
      return item['title of project'].toLowerCase().includes(searchQuery.toLowerCase())
    })

    // Filter by Category
    if (category !== 'ALL') {
      filteredData = Object.values(jsonData).filter((item) => item['Category'].toLowerCase().includes(category.toLowerCase()));
    }

    // Filter by Faculty
    if (faculty !== 'ALL') {
      filteredData = Object.values(jsonData).filter((item) => item['Faculty'].toLowerCase().includes(faculty.toLowerCase()));
    }

    setFilteredData(filteredData);
  }, [searchQuery, category, faculty, jsonData , facultyJson]);

  const handleSearch = (e) => {

    setSearchQuery(e.target.value);
    setCategory('ALL');
    setFaculty('ALL');
  }

  const handleClick = (item) => {
    setShow(true)
    setData(item)
    console.log(item)
  }

  const handleCategory = (e) => {
    setCategory(e.target.value)
    console.log(filteredData)
  }

  const handleFaculty = (e) => {
    setFaculty(e.target.value)
  }

  const handleAdd = () => {
    setInputShow(true)
  }

  // Get all unique faculty names
 useEffect(()=>{
    let arrfac=[];
    Object.keys(facultyJson).forEach(item => {
      arrfac.push(item);
    });
    
    setFacultyArray((prev)=>[...prev,...arrfac]);

  },[facultyJson]);

  return (
    <>
      <div className="main-search-div">
        <div className="inside-search-div">
          <input
            placeholder='search project.....'
            type='text'
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="multi-div">
            <div>
              <span>Choose by Category : </span>
              <select onChange={handleCategory} value={category}>
                <option>ALL</option>
                <option>AI/ML</option>
                <option>Web/App Dev</option>
                <option>Blockchain</option>
                <option>Hardware/Electronics</option>
                <option>other</option>
              </select>
            </div>
            <div>
              <span>Choose by Faculty : </span>
              <select onChange={handleFaculty} value={faculty}>
                {facultyArray.map((facultyName) => (
                  <option key={facultyName} value={facultyName}>
                    {facultyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-proj">
              <button onClick={handleAdd}>Add project</button>
            </div>
          </div>

          <div className="title-data-div">
            {filteredData.map((item) => (
              <div className='title-box' onClick={() => handleClick(item)}>
                {item['title of project']}
              </div>
            ))}
          </div>
        </div>

        {show && <InfoModal setShow={setShow} info={data} jsonData={jsonData} setJsonData={setJsonData}/>}
        {inputshow && <InputModal setInputShow={setInputShow} jsonData={jsonData} setJsonData={setJsonData} facultyArray={facultyArray}/>}
      </div>
    </>
  );
}
