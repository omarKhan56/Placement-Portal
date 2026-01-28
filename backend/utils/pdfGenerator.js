const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateCertificate = async (certificateData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
      const fileName = `certificate_${certificateData.certificateNumber}.pdf`;
      const filePath = path.join(__dirname, '../uploads', fileName);

      // Ensure uploads directory exists
      if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
        fs.mkdirSync(path.join(__dirname, '../uploads'));
      }

      doc.pipe(fs.createWriteStream(filePath));

      // Certificate design
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

      doc.fontSize(32).font('Helvetica-Bold').text('CERTIFICATE', 0, 100, { align: 'center' });
      doc.fontSize(18).font('Helvetica').text('OF COMPLETION', 0, 140, { align: 'center' });

      doc.fontSize(14).font('Helvetica').text('This is to certify that', 0, 200, { align: 'center' });
      doc.fontSize(24).font('Helvetica-Bold').text(certificateData.studentName, 0, 230, { align: 'center' });

      doc.fontSize(14).font('Helvetica').text('has successfully completed the internship program', 0, 270, { align: 'center' });
      doc.fontSize(20).font('Helvetica-Bold').text(certificateData.internshipTitle, 0, 300, { align: 'center' });

      doc.fontSize(14).font('Helvetica').text(`at ${certificateData.company}`, 0, 340, { align: 'center' });
      doc.text(`from ${certificateData.startDate} to ${certificateData.endDate}`, 0, 370, { align: 'center' });

      doc.fontSize(12).text(`Certificate Number: ${certificateData.certificateNumber}`, 0, 430, { align: 'center' });
      doc.text(`Verification Code: ${certificateData.verificationCode}`, 0, 450, { align: 'center' });

      doc.fontSize(10).text(`Issued on: ${new Date().toLocaleDateString()}`, 0, 500, { align: 'center' });

      doc.end();

      doc.on('finish', () => {
        resolve(filePath);
      });

    } catch (error) {
      reject(error);
    }
  });
};