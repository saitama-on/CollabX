import React from 'react'
import '../styles/searchBar.css'
import {useState , useEffect} from 'react'
import InfoModal from "./modal.jsx"
import InputModal from "./inputmodal.jsx"
import { initializeApp } from "firebase/app";
import {ref , getStorage , uploadBytes , getDownloadURL , list} from  'firebase/storage';
import {getAuth, signInWithPopup, GoogleAuthProvider , signOut} from "firebase/auth";
import { useFormState } from "react-dom";

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

export default function SearchBar(){
    const [show , setShow] = useState(false)
    const [data , setData] = useState({})
    const [searchQuery , setSearchQuery] = useState('')
    const [category , setCategory] = useState('ALL')
    const [inputshow , setInputShow] = useState(false);
    const [jsonData, setJsonData] = useState({});

    const [filteredData , setFilteredData] = useState([])

    
      useEffect(() => {
        const fetchData = async () => {
           
          try {
            const infoUrl = await getDownloadURL(ref(storage, 'student/info1.json'));
            console.log(infoUrl)
            const response = await fetch(`https://cors-anywhere-wbl8.onrender.com/${infoUrl}`
            );
            const data= await response.json();
            setJsonData(data);
            console.log(Object.keys(data))
      
            // setJsonData(data);
          } catch (error) {
            console.error("Error fetching JSON data:", error);
          }
        };
      
        fetchData();
      }, []);
     

    useEffect(()=>{

        let filteredData = Object.values(jsonData).filter(
            (item) =>{
               return  item['title of project'].toLowerCase().includes(searchQuery.toLowerCase())
            }
        )
  
        let filteredData2 = Object.values(jsonData).filter(
            (item) =>{
                return item['Category'].toLowerCase().includes(category.toLowerCase())
            }
        )

        if (category !== 'ALL'){
            setFilteredData(filteredData2)
        }

        else{
            setFilteredData(filteredData)
        }


    } , [searchQuery , category , jsonData])



    const handleSearch = (e) => {
        console.log(e.target.value)
        setSearchQuery(e.target.value);
        setCategory('ALL')

    }

    const handleClick =(item) =>{
        setShow(true)
        setData(item)
        console.log(item)
    }

    
    const handleCategory = (e) =>{
            setCategory(e.target.value)
            console.log(filteredData)
}


    const handleAdd = ()=>{
        setInputShow(true)
    }


    return(
        <>
        <div className="main-search-div">
            <div className="inside-search-div">
                <input placeholder='search project.....'
                type='text'
                value={searchQuery}
                onChange={handleSearch}>

                </input>
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
                    <div className="add-proj">
                    
                <button onClick={handleAdd}>Add project</button>
                
                    </div>
                </div>
                
                <div className="title-data-div">
                    {filteredData.map((item)=>(
                        <div className='title-box' onClick={()=>handleClick(item)}>{item['title of project']}</div>
                    ))}
                </div> 
            
            </div>
            
            {show && <InfoModal setShow={setShow} info={data}/> }
            {inputshow && <InputModal setInputShow={setInputShow} jsonData={jsonData} setJsonData={setJsonData} />}
        </div>
        </>
    );
}