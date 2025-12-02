import './Home.css'
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import pdfToText from 'react-pdftotext'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

function Home({ infoFilled, userID, isLoggedIn, address, phoneNumber, email, firstName, lastName }) {
  // State to hold selected options, job description, and current step, etc
  const [documentType, setDocumentType] = useState('Resume');
  const [personDescription, setPersonDescription] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [doneGenerating, setDoneGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(0);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [doneFavorite, setDoneFavorite] = useState(false);

  const navigate = useNavigate();

  // Handle the dropdown menu
  const handleDropdownChange = (event) => {
    // console.log(event.target.value)
    // if(event.target.value === 'resume scratch') {
    //   navigate('/resumebuild');
    // }
    setDocumentType(event.target.value);
  };

  // Handle the OK button click
  const handleOkClick = () => {
    if (step === 1) {
      if (documentType === 'resume scratch') {
        navigate('/resumebuild');
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // console.log(documentType, personDescription, jobDescription);

      axios.post("http://localhost:5000/api/main", {
        documentType: documentType,
        personDescription: personDescription,
        jobDescription: jobDescription
      }).then(response => {
        setResult(response.data.result);
        setJobTitle(response.data.jobTitle);
        setCompanyName(response.data.companyName);
        setDoneGenerating(true);
        setStep(4);  // Move to the final step
      }).catch(error => {
        console.error('There was an error submitting the data!', error);
      });
      // setStep(4);
    } else if (step === 4) {
      pdfExport();
      // Done
    }
  };

  // // Handle GET request
  // const handleGetRequest = async () => {
  //   try {
  //     // Make GET request to retrieve the result
  //     const getResponse = await axios.get("http://localhost:5000/api/main");
  //     console.log(getResponse.data.result);  // Log the retrieved result
  //     setResult(getResponse.data.result);  // Set the result in state
  //     setStep(4);  // Move to the next step
  //   } catch (error) {
  //     console.error('There was an error with the GET request!', error);
  //   }
  // };

  // Handle the arrow button click
  const handleArrowClick = (direction) => {
    console.log(infoFilled);
    if (direction === 'next') {
      setStep(prevStep => Math.min(prevStep + 1, doneGenerating ? 4 : 3)); // Move to the next step, but not above 4
    } else if (direction === 'previous') {
      setStep(prevStep => Math.max(prevStep - 1, 1)); // Move to the previous step, but not below 1
    }
  };

  // Handle the input change for job description
  const handlePersonInputChange = (event) => {
    setPersonDescription(event.target.value);
  };

  // Handle the input change for job description
  const handleJobInputChange = (event) => {
    setJobDescription(event.target.value);
  };

  // Handle file import
  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      const file = event.target.files[0]
      pdfToText(file)
        // .then(text => console.log(text))
        .then(text => setPersonDescription(text))
        .catch(error => console.error("Failed to extract text from pdf"))

      setFile(uploadedFile);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleFavoriting = () => {
    if (!doneFavorite) {
      axios.post("http://localhost:5000/database/favoriting", {
        user_id: userID,
        documentType: documentType,
        result: result,
        jobTitle: jobTitle,
        companyName: companyName
      }).then(response => {
        console.log('Success:', response.data.message);
        setDoneFavorite(true);
      }).catch(error => {
        console.error('There was an error submitting the data!', error);
      });
    }
  }

  const pdfExport = async () => {
    try {
      console.log('PDF export');

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();

      // Define font size and color
      const fontSize = 10;
      const fontColor = rgb(0, 0, 0);

      // Define fonts
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const fontItalics = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
      const fontBoldItalics = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

      // Define starting position
      let yPosition = height - 50;

      // Draw first name
      page.drawText(firstName, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: fontBold,
        color: fontColor,
      });

      // Draw last name
      // yPosition -= 20;
      page.drawText(lastName, {
        x: 50 + (firstName.length * 5.5),
        y: yPosition,
        size: fontSize,
        font: fontBold,
        color: fontColor,
      });

      // Draw phone number
      yPosition -= 20;
      page.drawText(phoneNumber, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: font,
        color: fontColor,
      });

      // Draw email
      yPosition -= 20;
      page.drawText(email, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: font,
        color: fontColor,
      });

      // Draw address
      yPosition -= 20;
      page.drawText(address, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: font,
        color: fontColor,
      });

      // Draw the content
      yPosition -= 40;
      page.drawText(result, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: font,
        color: fontColor,
        maxWidth: width - 100,
      });

      // Draw sincerely
      yPosition -= result.length / 4 + 20;
      page.drawText("Sincerely,", {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: font,
        color: fontColor,
        maxWidth: width - 100,
      });

      // Draw sincerely
      yPosition -= 20;
      page.drawText(firstName + " " + lastName, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: font,
        color: fontColor,
        maxWidth: width - 100,
      });

      const pdfBytes = await pdfDoc.save();

      console.log('PDF created successfully.');

      let currentDate = new Date().toJSON().slice(0, 10);
      console.log(currentDate);

      // Create a blob to download it
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentDate + ' ' + jobTitle + ' at ' + companyName + '.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="Test">
      <div id='mainBody'>
        <div id='centerThing'>
          <div id='stepsThing'>
            {step} &rarr;
          </div>
          <div id='centerCenterTop'>
            {step === 1 && "Let's get started! How can we help you today?"}
            {step === 2 && "Paste your resume/CV or cover letter in the textbox!"}
            {step === 3 && "Paste the job description below in the textbox!"}
            {step === 4 && "Here is your adjusted " + documentType + " for your job!"}
          </div>
          <div id='centerCenterCenter'>
            {step === 1 ? (
              <>
                <select className='dropdown' value={documentType} onChange={handleDropdownChange}>
                  <option value="resume">Create a Resume</option>
                  <option value="cover letter">Create a Cover Letter</option>
                  <option value="resume scratch">Create a Resume From Scratch</option>
                  {/* <option value="cover letter scratch">Create a Cover Letter From Scratch</option> */}
                </select>
              </>
            ) : step === 2 ? (
              <>
                <textarea
                  value={personDescription}
                  onChange={handlePersonInputChange}
                  placeholder='Enter your resume/cv or cover letter here... '
                  className='inputBox'
                />
              </>
            ) : step === 3 ? (
              <textarea
                value={jobDescription}
                onChange={handleJobInputChange}
                placeholder='Enter your job description or job position link here...'
                className='inputBox'
              />
            ) : (
              <div className='resultBox'>
                {result
                  .trim()
                  .split('\n')
                  .map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                {(!doneFavorite && isLoggedIn) && <button type='button' className='favoritesButton-home' onClick={() => handleFavoriting()}>&#9734;</button>}
                {(doneFavorite) && <button type='button' className='favoritesButton-home' onClick={() => handleFavoriting()}>&#9733;</button>}
              </div>
            )}
          </div>
          <div id='centerCenterBot'>
            {step != 4 && <button type='button' className='OKbutton' onClick={handleOkClick}>
              {/* {((step === 4) ? 'Export' : 'OK')} */}
              OK
            </button>}
            {(step == 4 && infoFilled && isLoggedIn && documentType == 'cover letter') && <button type='button' className='ExportButton' onClick={pdfExport}>
              Export
            </button>}
          </div>
          {(step === 2) && (
            <div className="file-upload">
              <input
                type="file"
                id="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="file" className="custom-file-upload">
                &#x1F4CE;
              </label>
              {file && <p className='fileUploadName'>{file.name}</p>}
            </div>
          )}
          {/* {(step === 4 && infoFilled) && (
            <div className="file-download">
              <button id='fileExportButton' onClick={() => pdfExport()}> ECASDASD </button>
            </div>
          )} */}
        </div>
      </div>
      <div id='footer'>
        <div id='buttonContainer'>
          <button type='button' className='arrowButton' onClick={() => handleArrowClick('previous')}>&larr;</button>
          <button type='button' className='arrowButton' onClick={() => handleArrowClick('next')}>&rarr;</button>
        </div>
      </div>

    </div>
  );
}

export default Home
