from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import traceback
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
import io
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

class ResumeGenerator:
    def __init__(self, data, theme):
        self.data = data
        self.theme = theme
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
        
    def setup_custom_styles(self):
        try:
            # Create custom styles based on selected theme
            primary_color = HexColor(self.theme.get('primary', '#1e40af'))
            secondary_color = HexColor(self.theme.get('secondary', '#3b82f6'))
            accent_color = HexColor(self.theme.get('accent', '#93c5fd'))
            
            # Header style
            self.styles.add(ParagraphStyle(
                name='CustomTitle',
                parent=self.styles['Heading1'],
                fontSize=24,
                textColor=primary_color,
                spaceAfter=12,
                fontName='Helvetica-Bold'
            ))
            
            # Section header style
            self.styles.add(ParagraphStyle(
                name='SectionHeader',
                parent=self.styles['Heading2'],
                fontSize=16,
                textColor=primary_color,
                spaceBefore=16,
                spaceAfter=8,
                fontName='Helvetica-Bold'
            ))
            
            # Job title style
            self.styles.add(ParagraphStyle(
                name='JobTitle',
                parent=self.styles['Normal'],
                fontSize=14,
                textColor=secondary_color,
                fontName='Helvetica-Bold',
                spaceBefore=8,
                spaceAfter=2
            ))
            
            # Company style
            self.styles.add(ParagraphStyle(
                name='Company',
                parent=self.styles['Normal'],
                fontSize=12,
                textColor=colors.black,
                fontName='Helvetica-Bold',
                spaceAfter=4
            ))
            
            # Contact info style
            self.styles.add(ParagraphStyle(
                name='Contact',
                parent=self.styles['Normal'],
                fontSize=11,
                textColor=secondary_color,
                spaceAfter=4
            ))
            
        except Exception as e:
            print(f"Error setting up styles: {e}")
            # Fallback to basic styles if custom ones fail

    def generate_pdf(self):
        try:
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, 
                                  topMargin=72, bottomMargin=18)
            
            story = []
            
            # Header section
            story.extend(self.create_header())
            
            # Experience section
            if self.data.get('experience') and len(self.data['experience']) > 0:
                story.extend(self.create_experience_section())
                
            # Education section
            if self.data.get('education') and len(self.data['education']) > 0:
                story.extend(self.create_education_section())
                
            # Skills section
            if self.data.get('skills') and len(self.data['skills']) > 0:
                story.extend(self.create_skills_section())
            
            doc.build(story)
            buffer.seek(0)
            return buffer
            
        except Exception as e:
            print(f"Error generating PDF: {e}")
            print(f"Full traceback: {traceback.format_exc()}")
            raise
    
    def create_header(self):
        story = []
        personal = self.data.get('personalInfo', {})
        
        # Name
        if personal.get('fullName'):
            name_text = personal['fullName']
            if 'CustomTitle' in [style.name for style in self.styles.values()]:
                story.append(Paragraph(name_text, self.styles['CustomTitle']))
            else:
                story.append(Paragraph(name_text, self.styles['Heading1']))
        
        # Contact information (simplified to avoid emoji issues)
        contact_parts = []
        if personal.get('email'):
            contact_parts.append(f"Email: {personal['email']}")
        if personal.get('phone'):
            contact_parts.append(f"Phone: {personal['phone']}")
        if personal.get('location'):
            contact_parts.append(f"Location: {personal['location']}")
        if personal.get('linkedin'):
            contact_parts.append(f"LinkedIn: {personal['linkedin']}")
        
        if contact_parts:
            contact_text = " | ".join(contact_parts)
            story.append(Paragraph(contact_text, self.styles['Normal']))
        
        # Summary
        if personal.get('summary'):
            story.append(Spacer(1, 12))
            story.append(Paragraph(personal['summary'], self.styles['Normal']))
        
        story.append(Spacer(1, 20))
        return story
    
    def create_experience_section(self):
        story = []
        story.append(Paragraph("EXPERIENCE", self.styles['Heading2']))
        
        for exp in self.data['experience']:
            if exp.get('position') or exp.get('company'):
                # Job title
                title_text = exp.get('position', '')
                if title_text:
                    story.append(Paragraph(title_text, self.styles['Heading3']))
                
                # Company and dates
                company_info = []
                if exp.get('company'):
                    company_info.append(exp['company'])
                
                dates = f"{exp.get('startDate', '')} - {'Present' if exp.get('current') else exp.get('endDate', '')}"
                if dates.strip() != ' - ':
                    company_info.append(dates)
                
                if company_info:
                    story.append(Paragraph(" | ".join(company_info), self.styles['Normal']))
                
                # Description
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], self.styles['Normal']))
                
                story.append(Spacer(1, 12))
        
        return story
    
    def create_education_section(self):
        story = []
        story.append(Paragraph("EDUCATION", self.styles['Heading2']))
        
        for edu in self.data['education']:
            if edu.get('degree') or edu.get('institution'):
                # Degree
                degree_parts = []
                if edu.get('degree'):
                    degree_parts.append(edu['degree'])
                if edu.get('field'):
                    degree_parts.append(f"in {edu['field']}")
                
                if degree_parts:
                    story.append(Paragraph(" ".join(degree_parts), self.styles['Heading3']))
                
                # Institution and dates
                institution_info = []
                if edu.get('institution'):
                    institution_info.append(edu['institution'])
                
                dates = f"{edu.get('startDate', '')} - {edu.get('endDate', '')}"
                if dates.strip() != ' - ':
                    institution_info.append(dates)
                
                if edu.get('gpa'):
                    institution_info.append(f"GPA: {edu['gpa']}")
                
                if institution_info:
                    story.append(Paragraph(" | ".join(institution_info), self.styles['Normal']))
                
                story.append(Spacer(1, 12))
        
        return story
    
    def create_skills_section(self):
        story = []
        story.append(Paragraph("SKILLS", self.styles['Heading2']))
        
        for skill in self.data['skills']:
            if skill.get('category') and skill.get('items'):
                # Category
                story.append(Paragraph(skill['category'], self.styles['Heading3']))
                
                # Skills as a formatted list
                skills_text = " • ".join(skill['items'])
                story.append(Paragraph(skills_text, self.styles['Normal']))
                story.append(Spacer(1, 8))
        
        return story

@app.route('/generate-resume', methods=['POST'])
def generate_resume():
    try:
        print("Received PDF generation request")
        
        # Check if request has JSON data
        if not request.json:
            print("No JSON data received")
            return jsonify({'error': 'No data provided'}), 400
        
        data = request.json
        resume_data = data.get('resumeData')
        theme = data.get('theme')
        
        print(f"Resume data keys: {list(resume_data.keys()) if resume_data else 'None'}")
        print(f"Theme: {theme}")
        
        if not resume_data:
            return jsonify({'error': 'Resume data is required'}), 400
        
        if not theme:
            # Provide default theme if none provided
            theme = {
                'primary': '#1e40af',
                'secondary': '#3b82f6', 
                'accent': '#93c5fd',
                'text': '#1f2937'
            }
        
        generator = ResumeGenerator(resume_data, theme)
        pdf_buffer = generator.generate_pdf()
        
        # Generate filename
        personal_info = resume_data.get('personalInfo', {})
        full_name = personal_info.get('fullName', 'Resume')
        # Clean filename to avoid issues
        filename = f"{full_name.replace(' ', '_')}_Resume.pdf"
        
        print(f"Generated PDF successfully, filename: {filename}")
        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error in generate_resume: {error_msg}")
        print(f"Full traceback: {traceback.format_exc()}")
        return jsonify({'error': error_msg}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)