import React, { useState } from "react";
import '../styles/inputmodal.css'
import { initializeApp } from "firebase/app";
import {ref , getStorage , uploadBytes , getDownloadURL , list} from  'firebase/storage';
import {getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


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
const auth = getAuth();

export default function InputModal({ setInputShow }) {
  const [groupMembers, setGroupMembers] = useState([""]);
  const [title, setTitle] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [faculty, setFaculty] = useState("");
  const [file, setFile] = useState(null);
 

  const handleClose = () => setInputShow(false);

  // Add New Group Member
  const addGroupMember = () => {
    setGroupMembers([...groupMembers, ""]);
    
  };

  // Remove Group Member
  const removeGroupMember = (index) => {
    const updatedMembers = groupMembers.filter((_, i) => i !== index);
    setGroupMembers(updatedMembers);
  };

  // Handle Input Change for Group Members
  const handleGroupMemberChange = (index, value) => {
    const updatedMembers = [...groupMembers];
    updatedMembers[index] = value;
    setGroupMembers(updatedMembers);
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  // Remove Uploaded File
  const removeFile = () => {
    setFile(null);
  };

  // Validate Inputs
  const handleSubmit = () => {
    let hasError = false;

    if (!title.trim()) {
      highlightError("title");
      hasError = true;
    }
    if (!researchArea.trim()) {
      highlightError("researchArea");
      hasError = true;
    }
    if (!faculty.trim()) {
      highlightError("faculty");
      hasError = true;
    }
    if (groupMembers.some((member) => !member.trim())) {
      highlightError("groupMembers");
      hasError = true;
    }
    if (!file) {
      alert("Please upload a research paper.");
      hasError = true;
    }

    if (!hasError) {
      alert("Project Submitted Successfully!");
      console.log({ title, researchArea, faculty, groupMembers, file });
      handleUploadData(title , researchArea , faculty , groupMembers , file);
    }
  };


  const handleUploadData = async(title , researchArea , faculty , groupMembers , file) =>{

    try {
        if(!auth){
            return signInWithPopup(auth,provider);
            
        }
        else{
          console.log("hai rre baba!!",auth)
        }

        
    }

    catch(err){
      console.log(err);
    }


  }

  // Highlight Error Input
  const highlightError = (id) => {
    document.getElementById(id)?.classList.add("error");
    
  };

  return (
    <div className="custom-modal-overlay" onClick={handleClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <h3>Add New Project</h3>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body">
          <div className="inside-modal-div">
            <label><strong>Title of Project:</strong></label>
            <input id="title" type="text" placeholder="Enter project title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="inside-modal-div">
            <label><strong>Area of Research:</strong></label>
            <input id="researchArea" type="text" placeholder="Enter research area" value={researchArea} onChange={(e) => setResearchArea(e.target.value)} />
          </div>
          <div className="inside-modal-div">
            <label><strong>Faculty:</strong></label>
            <input id="faculty" type="text" placeholder="Enter faculty name" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
          </div>
          <div className="inside-modal-div">
            <label><strong>Group Members:</strong></label>
            <div id="groupMembers" className="group-members-container">
              {groupMembers.map((member, index) => (
                <div key={index} className="group-member">
                  <input
                    type="text"
                    placeholder={`Member ${index + 1}`}
                    value={member}
                    onChange={(e) => handleGroupMemberChange(index, e.target.value)}
                  />
                  {groupMembers.length > 1 && (
                    <button className="remove-member" onClick={() => removeGroupMember(index)}>×</button>
                  )}
                </div>
              ))}
              {groupMembers.length <= 3 && <button className="add-member-btn" onClick={addGroupMember}>+ Add Member</button>}
            </div>
          </div>
          <div className="inside-modal-div">
            <label><strong>Upload Research Paper:</strong></label>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
            {file && (
              <div className="file-info">
                <span>{file.name}</span>
                <button className="remove-file" onClick={removeFile}>×</button>
              </div>
            )}
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
