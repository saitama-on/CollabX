import React, { useState, useEffect } from 'react';
import '../styles/searchBar.css';
import InfoModal from "./modal.jsx";
import InputModal from "./inputmodal.jsx";

export default function SearchBar({ jsonData }) {
    const [show, setShow] = useState(false);
    const [data, setData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('ALL');
    const [faculty, setFaculty] = useState('ALL');
    const [inputshow, setInputShow] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [facultyList, setFacultyList] = useState([]); // Stores unique faculty names

    // Extract unique faculty names
    useEffect(() => {
        const faculties = new Set();
        Object.values(jsonData).forEach(item => {
            if (item['Faculty']) {
                faculties.add(item['Faculty']);  // Collect unique faculty names
            }
        });
        setFacultyList(['ALL', ...Array.from(faculties)]);  // Convert to array and add 'ALL' option
    }, [jsonData]);

    // Filtering logic
    useEffect(() => {
        let filteredData = Object.values(jsonData).filter(item =>
            item['title of project'].toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (category !== 'ALL') {
            filteredData = filteredData.filter(item =>
                item['Category'].toLowerCase() === category.toLowerCase()
            );
        }

        if (faculty !== 'ALL') {
            filteredData = filteredData.filter(item =>
                item['Faculty']?.toLowerCase() === faculty.toLowerCase()
            );
        }

        setFilteredData(filteredData);
    }, [searchQuery, category, faculty, jsonData]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCategory('ALL');
        setFaculty('ALL');
    };

    const handleCategory = (e) => {
        setCategory(e.target.value);
    };

    const handleFaculty = (e) => {
        setFaculty(e.target.value);
    };

    const handleClick = (item) => {
        setShow(true);
        setData(item);
    };

    const handleAdd = () => {
        setInputShow(true);
    };

    return (
        <div className="main-search-div">
            <div className="inside-search-div">
                <input
                    placeholder='Search project...'
                    type='text'
                    value={searchQuery}
                    onChange={handleSearch}
                />

                <div className="multi-div">
                    <div>
                        <span>Choose by Category: </span>
                        <select onChange={handleCategory} value={category}>
                            <option>ALL</option>
                            <option>AI/ML</option>
                            <option>Web/App Dev</option>
                            <option>Blockchain</option>
                            <option>Hardware/Electronics</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <span>Choose by Faculty: </span>
                        <select onChange={handleFaculty} value={faculty}>
                            {facultyList.map((fac, index) => (
                                <option key={index} value={fac}>{fac}</option>
                            ))}
                        </select>
                    </div>

                    <div className="add-proj">
                        <button onClick={handleAdd}>Add Project</button>
                    </div>
                </div>

                <div className="title-data-div">
                    {filteredData.map((item, index) => (
                        <div key={index} className='title-box' onClick={() => handleClick(item)}>
                            {item['title of project']}
                        </div>
                    ))}
                </div>
            </div>

            {show && <InfoModal setShow={setShow} info={data} />}
            {inputshow && <InputModal setInputShow={setInputShow} />}
        </div>
    );
}
