import React, { useState } from 'react';
import './ResumePage.css';
import axios from 'axios';

function ResumePage() {
  // State variables for the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [result, setResult] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Handle input changes
  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePhoneNumberChange = (event) => setPhoneNumber(event.target.value);
  const handleAddressChange = (event) => setAddress(event.target.value);
  const handleUniversityChange = (event) => setUniversity(event.target.value);
  const handleMajorChange = (event) => setMajor(event.target.value);
  const handleWorkExperienceChange = (event) => setWorkExperience(event.target.value);
  const handleSkillsChange = (event) => setSkills(event.target.value);

  // Handle form submission
  const handleSubmit = () => {
    // event.preventDefault();
    // console.log('Name:', name);
    // console.log('Email:', email);
    // console.log('Phone Number:', phoneNumber);
    // console.log('Address:', address);
    // console.log('University:', university);
    // console.log('Major:', major);
    // console.log('Work Experience:', workExperience);
    // console.log('Skills:', skills);
    axios.post("http://localhost:5000/api/resumepage", {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      university: university,
      major: major,
      workExperience: workExperience,
      skills: skills
    }).then(response => {
      console.log(response.data.result);
      setResult(response.data.result);
      setIsPopupVisible(true);
    }).catch(error => {
      console.error('There was an error submitting the data!', error);
    });
    // setResult("WOAWEEE");
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="resumePageWrapper">
      <div className="container-resumePage">
        <div className="Resume">
          <h1 className="resume-header">Create Your Resume</h1>
          <form onSubmit={handleSubmit} className="resume-form">
            <div className="column">
              <div className="form-group-resumePage">
                <label className='label-ResumePage' htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  className="input-field-resumePage"
                />
              </div>

              <div className="form-group-resumePage">
                <label className='label-ResumePage' htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className="input-field-resumePage"
                />
              </div>

              <div className="form-group-resumePage">
                <label className='label-ResumePage' htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter your phone number"
                  className="input-field-resumePage"
                />
              </div>

              <div className="form-group-resumePage">
                <label className='label-ResumePage' htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter your address"
                  className="input-field-resumePage"
                />
              </div>

              <div className="form-group-resumePage">
                <label className='label-ResumePage' htmlFor="university">University:</label>
                <input
                  type="text"
                  id="university"
                  value={university}
                  onChange={handleUniversityChange}
                  placeholder="Enter your university"
                  className="input-field-resumePage"
                />
              </div>

              <div className="form-group-resumePage">
                <label className='label-ResumePage' htmlFor="major">Major:</label>
                <input
                  type="text"
                  id="major"
                  value={major}
                  onChange={handleMajorChange}
                  placeholder="Enter your major"
                  className="input-field-resumePage"
                />
              </div>
            </div>

            <div className="column textarea-column">
              <div className="form-group-resumePage">
                <label className='label-ResumePage' htmlFor="workExperience">Work Experience:</label>
                <textarea
                  id="workExperience"
                  value={workExperience}
                  onChange={handleWorkExperienceChange}
                  placeholder="Describe your work experience"
                  className="input-box-resumePage"
                />
              </div>

              <div className="form-group-resumePage">
                <label className='label-ResumePage' htmlFor="skills">Skills:</label>
                <textarea
                  id="skills"
                  value={skills}
                  onChange={handleSkillsChange}
                  placeholder="List your skills"
                  className="input-box-resumePage"
                />
              </div>
            </div>

            <div className="form-group-resumePage" style={{ width: '100%' }}>
              <button type="button" className="submitButton-resumePage" onClick={() => handleSubmit()}>Submit</button>
            </div>
          </form>
        </div>
      </div>
      {isPopupVisible && <ResultPopup result={result} onClose={handleClosePopup} />}
    </div>
  );
}

export default ResumePage;

function ResultPopup({ result, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {result
          .trim()
          .split('\n')
          .map((line, index) => (
            <p key={index} className="popup-line">{line}</p>
          ))}
        <button onClick={onClose} className="close-popup-button">Close</button>
      </div>
    </div>
  );
}