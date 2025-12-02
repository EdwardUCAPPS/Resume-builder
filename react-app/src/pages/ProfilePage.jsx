import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage({ userID, setInfoFilled, address, setAddress, phoneNumber, setPhoneNumber, email, setEmail, firstName, setFirstName, lastName, setLastName }) {
  // const [address, setAddress] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [email, setEmail] = useState('');
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  const [major, setMajor] = useState('');
  const [university, setUniversity] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (userID) {
      // console.log(userID)
      axios.get('http://localhost:5000/database/profile', { params: { id: userID } })
        .then(response => {
          const data = response.data;
          console.log(data)
          if (data.email) {
            setAddress(data.address);
            setPhoneNumber(data.phoneNumber);
            setEmail(data.email);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setMajor(data.major);
            setUniversity(data.university);

            if (data.address != '' && data.phoneNumber != '' && data.email != '' && data.firstName != '' && data.lastName != '') {
              setInfoFilled(true);
            }
            else {
              setInfoFilled(false);
            }
          } else {
            console.error('User not found');
            setEditMode(false);
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [userID]);

  // Handle input changes
  const handleAddressChange = (event) => setAddress(event.target.value);
  const handlePhoneNumberChange = (event) => setPhoneNumber(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleFirstNameChange = (event) => setFirstName(event.target.value);
  const handleLastNameChange = (event) => setLastName(event.target.value);
  const handleMajorChange = (event) => setMajor(event.target.value);
  const handleUniversityChange = (event) => setUniversity(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post("http://localhost:5000/database/profile", {
      id: userID,
      email: email,
      firstName: firstName,
      lastName: lastName,
      major: major,
      university: university,
      address: address,
      phoneNumber: phoneNumber
    }).then(response => {
      console.log('Success:', response.data);
      setEditMode(false);
    })
      .catch(error => console.error('Error updating user data:', error));
    // setEditMode(false);
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="Profile">
      <div id='mainBodyProfile'>
        <button type='button' id='editButton' onClick={handleEditClick}>
        {!editMode ? 'Edit' : 'Back'}
        </button>
        {!editMode ? (
          <div>
            <h1 id='profileInfoTitle'>Profile Information</h1>
            {/* <button type='button' id='editButton' onClick={handleEditClick}>Edit</button> */}
            <div id='profileInfoDetails'>
              First Name: {firstName} <br />
              Last Name: {lastName} <br />
              Email: {email} <br />
              Major: {major} <br />
              University: {university} <br />
              Address: {address} <br />
              Phone: {phoneNumber} <br />
            </div>
          </div>
        ) : (
          <>
            <h1>Edit Information</h1>
            <form onSubmit={handleSubmit} className="profile-form-edit">
              {/* First Name Field */}
              <div className="form-group-edit">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  placeholder="Enter your first name"
                  className="input-field-edit"
                />
              </div>

              {/* Last Name Field */}
              <div className="form-group-edit">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={handleLastNameChange}
                  placeholder="Enter your last name"
                  className="input-field-edit"
                />
              </div>

              {/* Email Field */}
              <div className="form-group-edit">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className="input-field-edit"
                />
              </div>

              {/* Major Field */}
              <div className="form-group-edit">
                <label htmlFor="major">Major:</label>
                <input
                  type="text"
                  id="major"
                  value={major}
                  onChange={handleMajorChange}
                  placeholder="Enter your major"
                  className="input-field-edit"
                />
              </div>

              {/* University Field */}
              <div className="form-group-edit">
                <label htmlFor="university">University:</label>
                <input
                  type="text"
                  id="university"
                  value={university}
                  onChange={handleUniversityChange}
                  placeholder="Enter your university"
                  className="input-field-edit"
                />
              </div>

              {/* Address Field */}
              <div className="form-group-edit">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter your address"
                  className="input-field-edit"
                />
              </div>

              {/* Phone Number Field */}
              <div className="form-group-edit">
                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter your phone number"
                  className="input-field-edit"
                />
              </div>

              <div className="form-group-edit">
                <button type="submit" className='submitButton-profilePage'>Save</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;