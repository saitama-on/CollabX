import React from 'react'
import '../styles/searchBar.css'
import {useState , useEffect} from 'react'
import InfoModal from "./modal.jsx"
import InputModal from "./inputmodal.jsx"

export default function SearchBar({jsonData}){
    const [show , setShow] = useState(false)
    const [data , setData] = useState({})
    const [searchQuery , setSearchQuery] = useState('')
    const [category , setCategory] = useState('ALL')
    const [inputshow , setInputShow] = useState(false)

    const [filteredData , setFilteredData] = useState([])

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


    } , [searchQuery , category])

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
            {inputshow && <InputModal setInputShow={setInputShow} />}
        </div>
        </>
    );
}