import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeData, ColorTheme } from './types';

export const generatePDF = async (resumeRef: React.RefObject<HTMLDivElement>, resumeData: ResumeData, currentTheme: ColorTheme) => {
  try {
    // Create a temporary hidden div for PDF generation with consistent styling
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '14px';
    tempDiv.style.lineHeight = '1.5';
    tempDiv.style.color = '#000000';
    
    // Create the resume HTML structure for PDF
    tempDiv.innerHTML = `
      <div style="padding: 32px; min-height: 297mm; background: white;">
        <!-- Header -->
        <div style="margin-bottom: 32px;">
          <div style="width: 100%; height: 8px; background-color: ${currentTheme.primary}; margin-bottom: 24px;"></div>
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 8px; color: ${currentTheme.primary};">
            ${resumeData.personalInfo.fullName || 'Your Name'}
          </h1>
          <div style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 14px; margin-bottom: 16px;">
            ${resumeData.personalInfo.email ? `
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: ${currentTheme.secondary};">✉</span>
                ${resumeData.personalInfo.email}
              </div>
            ` : ''}
            ${resumeData.personalInfo.phone ? `
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: ${currentTheme.secondary};">📞</span>
                ${resumeData.personalInfo.phone}
              </div>
            ` : ''}
            ${resumeData.personalInfo.location ? `
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: ${currentTheme.secondary};">📍</span>
                ${resumeData.personalInfo.location}
              </div>
            ` : ''}
          </div>
          ${resumeData.personalInfo.summary ? `
            <p style="margin-top: 16px; font-size: 14px; line-height: 1.6; color: #374151;">
              ${resumeData.personalInfo.summary}
            </p>
          ` : ''}
        </div>

        <!-- Experience -->
        ${resumeData.experience.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${currentTheme.accent}; color: ${currentTheme.primary};">
              💼 Experience
            </h2>
            ${resumeData.experience.map(exp => `
              <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                  <h3 style="font-size: 18px; font-weight: 600; color: ${currentTheme.secondary};">
                    ${exp.position}
                  </h3>
                  <span style="font-size: 14px; color: #6b7280;">
                    ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p style="font-weight: 500; color: #374151; margin-bottom: 8px;">${exp.company}</p>
                ${exp.description ? `
                  <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
                    ${exp.description}
                  </p>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${resumeData.education.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${currentTheme.accent}; color: ${currentTheme.primary};">
              🎓 Education
            </h2>
            ${resumeData.education.map(edu => `
              <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                  <h3 style="font-size: 18px; font-weight: 600; color: ${currentTheme.secondary};">
                    ${edu.degree} ${edu.field ? `in ${edu.field}` : ''}
                  </h3>
                  <span style="font-size: 14px; color: #6b7280;">
                    ${edu.startDate} - ${edu.endDate}
                  </span>
                </div>
                <p style="font-weight: 500; color: #374151;">
                  ${edu.institution}
                  ${edu.gpa ? `<span style="margin-left: 8px; font-size: 14px;">GPA: ${edu.gpa}</span>` : ''}
                </p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Skills -->
        ${resumeData.skills.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${currentTheme.accent}; color: ${currentTheme.primary};">
              🏆 Skills
            </h2>
            ${resumeData.skills.map(skill => `
              <div style="margin-bottom: 12px;">
                <h3 style="font-weight: 600; margin-bottom: 4px; color: ${currentTheme.secondary};">
                  ${skill.category}
                </h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${skill.items.map(item => `
                    <span style="padding: 4px 8px; font-size: 12px; border-radius: 4px; background-color: ${currentTheme.accent}; color: ${currentTheme.text};">
                      ${item}
                    </span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(tempDiv);

    // Generate PDF from the temporary element
    const canvas = await html2canvas(tempDiv, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempDiv.scrollWidth,
      height: tempDiv.scrollHeight,
    });

    // Remove temporary element
    document.body.removeChild(tempDiv);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}_Resume.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error generating PDF. Please try again.');
  }
};

// Python-based PDF Generation (Professional Quality)
export const generatePDFWithPython = async (resumeData: ResumeData, currentTheme: ColorTheme) => {
  try {
    const response = await fetch('http://localhost:5000/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData: resumeData,
        theme: currentTheme
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName || 'Resume'}_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating PDF with Python service:', error);
    throw error;
  }
};

// Combined PDF generation function that tries Python first
export const handlePDFGeneration = async (
  resumeRef: React.RefObject<HTMLDivElement>, 
  resumeData: ResumeData, 
  currentTheme: ColorTheme
) => {
  // Try Python service first, fallback to client-side if unavailable
  try {
    const healthCheck = await fetch('http://localhost:5000/health');
    if (healthCheck.ok) {
      await generatePDFWithPython(resumeData, currentTheme);
    } else {
      await generatePDF(resumeRef, resumeData, currentTheme);
    }
  } catch (error) {
    // Python service not available, use client-side generation
    await generatePDF(resumeRef, resumeData, currentTheme);
  }
};