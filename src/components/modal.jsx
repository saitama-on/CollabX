import { useState , useEffect} from 'react';
import '../styles/modal.css';  
import { initializeApp } from "firebase/app";
import {ref , getStorage , uploadBytes , getDownloadURL , list} from  'firebase/storage';
import {getAuth, signInWithPopup, GoogleAuthProvider , signOut} from "firebase/auth";
import {getdatabase } from "firebase/database"

import {ThreeDot} from 'react-loading-indicators'


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


// const db = Database(app);

// const db_ref = ref()
const provider = new GoogleAuthProvider();
const auth = getAuth();



function InfoModal({ show, setShow, info , jsonData , setJsonData}) {

  const [yesauth , setYesAuth] = useState(false);
  const [file , setFile] = useState(null);
  const [paper , setPaper] = useState('');
  const [uploadsuccess , setUploadSuccess] = useState(false);
  const [loader , setLoader] = useState(false);
  

  useEffect(()=>{
    setLoader(true);
    setTimeout(()=>{
      setLoader(false);
      return;
    } , 3000);
    console.log(info)
    setPaper(info['Report']);
    console.log(paper)

  },[])


  const handleClose = () => {
    console.log(auth.currentUser);
    // auth.signOut();
    setShow(false)
  };


    // useEffect(()=>{
    //   const fetchLink = async()=>{
    //     const url = await getDownloadURL(ref(storage, `minor_proj/${info['title of ']}`))
    //     setLoader((prev)=>!prev);
      
    //   }

    // })

  const handleFileChange = (e) =>{
      setFile(e.target.files[0]);
  }

  const updateJson = async(url, title)=>{
    const required_key = Object.keys(jsonData).find((key)=>{
      return jsonData[key]['title of project'] === title;
    });
    console.log(required_key);

    jsonData[required_key].Report = url;
    setJsonData(jsonData);
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });     
    await uploadBytes(ref(storage, 'student/info1.json'), jsonBlob);
    console.log('updated');

  }

  const uploadData = async()=>{
    try{
    const storageRef = ref(storage , `minor_data/${info['title of project']}`);

        await uploadBytes(storageRef , file).then(async(snap)=>{
          alert("Uploaded Successfully");
          const url = await getDownloadURL(storageRef);
          setPaper(url);
          console.log(url);
          updateJson(url , info['title of project']);

          setUploadSuccess(true)
        })
      }

      catch(err){
        console.log(err);
      }
    
  }
  const handleAuth = async() =>{
    if(!file){
      alert('please select a file!!')
      return;
    }

    if(yesauth){ 
      console.log("fuck yeah", auth);
      setLoader(true);
      uploadData();
        
     }
    
    else{

      await signInWithPopup(auth,provider).then(()=>{
        setYesAuth(true);
        setLoader(true);
        uploadData();
    
      })
      
    }
  }

  return (
    <>
 
        <div className="custom-modal-overlay" onClick={handleClose}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <button className="close-button" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className="custom-modal-body">
              <div  className="inside-modal-div">
                <span  className="span-text">Title of Project : </span>{info['title of project']}
              </div>
              <div className="inside-modal-div">
                <span className="span-text">Area of Research : </span>{info['Area of Research']}
              </div>
              <div className="inside-modal-div">
                <span className="span-text">Faculty : </span>{info['Faculty']}
              </div>
              <div className="inside-modal-div">
                <span className="span-text">Group Members :</span>{info['Group Members'].map((data,key)=>{
                  return <span style={{margin:'2px'}}>{data}, </span>
                })}
              </div>
                  
                  {paper!='' ? 
                  <div className="inside-modal-div">
                <span className="span-text">Paper : </span><a href={paper} target="_blank">Link to paper</a>
              </div>: loader ? <ThreeDot color="#316dcc" size="medium" text="" textColor="" /> : <div>
                  <p>Is this your project ? </p>
                  <input type="file" onChange={handleFileChange}></input>
                  <button onClick={handleAuth}> Upload</button></div>}
                 
              </div>
            </div>
          </div>
  
    </>
  );
}

export default InfoModal;
