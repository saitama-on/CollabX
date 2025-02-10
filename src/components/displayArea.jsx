import React from 'react'
import '../styles/displayArea.css'
import InfoModal from './modal'
import {useState} from 'react'




export default function DisplayArea({info_json}){

    const [show, setShow] = useState(false);
    const [title , setTitle] = useState('');
    const [values , setValues] = useState({});


    function handleClick(info_title , project_info){
    
        setShow(true);
        setTitle(info_title);
        setValues(project_info)
    }
    

    return (
        <div className="main-container">
            <div className="inside-container">
                   
                    {Object.entries(info_json).map(([key,value], index) =>{
                        console.log(value)
                        return (<div className="title-box" onClick={ ()=>handleClick(key, value)
                        }>{value['title of project']}</div>)
                    })} 
            </div>

            {show && <InfoModal show={show} setShow={setShow} proj_title={title} info={values}/>}
        </div>


    )
}