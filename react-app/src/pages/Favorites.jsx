import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Favorites.css';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

function Favorites({ userID, address, phoneNumber, email, firstName, lastName }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    if (userID) {
      axios.get('http://localhost:5000/database/favorites', { params: { id: userID } })
        .then(response => {
          setDocuments(response.data.documents);
          setLoading(false);
        })
        .catch(error => {
          setError('Error fetching document favorites');
          setLoading(false);
        });
    }
  }, [userID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleViewClick = (doc) => {
    setSelectedDocument(doc);
  };

  const handleClosePopup = () => {
    setSelectedDocument(null);
  };

  const handleDelete = (doc) => {
    axios.delete("http://localhost:5000/database/favorites", {
      data: {
        user_id: userID,
        document_id: doc.document_id
      }
    })
      .then(response => {
        console.log('Delete Success:', response.data);
        setDocuments(documents.filter(d => d.document_id !== doc.document_id));
      })
      .catch(error => console.error('Error deleting document:', error));
  };

  const handleExport = async (doc) => {
    try {
      console.log('PDF export');

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();

      let result = doc.content;

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

      // Get date to name the file download nicely
      let currentDate = new Date().toJSON().slice(0, 10);
      console.log(currentDate);

      // Create a blob to download it
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentDate + ' ' + doc.job_title + ' at ' + doc.company_name + '.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  }

  return (
    // <div className='favoritesWrapper'>
    <div className="favoritesPage">
      <h1>Document Favorites</h1>
      <ul className="document-list">
        {documents.map((doc, index) => (
          <li key={index} className="document-item">
            <strong>{doc.job_title}</strong> <br></br>
            <strong>{doc.company_name}</strong> <br></br>
            <strong>Document Type:</strong> {doc.document_type} <br />
            <strong>Created:</strong> {new Date(doc.created_at).toLocaleDateString()} <br />
            <button className='document-item-view-button' onClick={() => handleViewClick(doc)}>View</button>
            <button className='document-item-delete-button' onClick={() => handleDelete(doc)}>X</button>
            {(doc.document_type == 'cover_letter' || doc.document_type == 'cover letter') && <button className='document-item-export-button' onClick={() => handleExport(doc)}>&darr;</button>}
          </li>
        ))}
      </ul>

      {selectedDocument && (
        <div className="popup-favorites">
          <div className="popup-content-favorites">
            <h2>{selectedDocument.job_title} at {selectedDocument.company_name} </h2>
            <h3>Created: {new Date(selectedDocument.created_at).toLocaleDateString()}</h3>
            {/* <p>{selectedDocument.content}</p> */}
            {selectedDocument.content
              .trim()
              .split('\n')
              .map((line, index) => (
                <p key={index} className="popup-line">{line}</p>
              ))}
            <button className='popup-favorites-close-button' onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
}

export default Favorites;