import { useState , useEffect} from 'react';
import '../styles/modal.css';  
import { initializeApp } from "firebase/app";
import {ref , getStorage , uploadBytes , getDownloadURL , list} from  'firebase/storage';
import {getAuth, signInWithPopup, GoogleAuthProvider , signOut} from "firebase/auth";
import {getdatabase } from "firebase/database"
import cors from 'cors'
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



function InfoModal({ show, setShow, info }) {

  const [yesauth , setYesAuth] = useState(false);
  const [file , setFile] = useState(null);
  const [paper , setPaper] = useState(info['paper']);
  const [uploadsuccess , setUploadSuccess] = useState(false);
  const [loader , setLoader] = useState(false);

  useEffect(()=>{
    setLoader(true);
    setTimeout(()=>{
      setLoader(false);
      return;
    } , 3000)
    const storage_ref = ref(storage , 'minor_data');

    const list_files = async()=>{
      try {
        const result = await list(storage_ref);
        const foundFile = result.items.find((fileRef) => fileRef.name === info['title of project']);

        if (foundFile){
          const url = await  getDownloadURL(ref(storage , `minor_data/${info['title of project']}`));
          
          setPaper(url)
          info['paper'] = url;
          console.log(url)
          setLoader(false);
        }

      }
      catch (error){
        console.log(error)
      }
    };


    list_files();

  },[uploadsuccess])


  const handleClose = () => {
    console.log(auth.currentUser);
    auth.signOut();
    setShow(false)
  };



  const handleFileChange = (e) =>{
      setFile(e.target.files[0]);
  }
  const handleAuth = async() =>{
    if(!file){
      alert('please select a file!!')
      return;
    }

    if(yesauth){ 
      console.log("fuck yeah", auth);
      setLoader(true);

        const storageRef = ref(storage , `minor_data/${info['title of project']}`)

        uploadBytes(storageRef , file).then((snap)=>{
          alert("Uploaded Successfully");
          
          setUploadSuccess(true)
        })
     }
    
    else{

      return signInWithPopup(auth,provider).then(()=>{
        setYesAuth(true)
        setLoader(true);
        const storageRef = ref(storage , `minor_data/${info['title of project']}`)
       

        uploadBytes(storageRef , file).then((snap)=>{
          alert("Uploaded Successfully")
          setUploadSuccess(true)
        })
    
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
                  
                  {paper ? 
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
