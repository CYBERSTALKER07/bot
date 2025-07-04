import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowLeft,
  Clock,
  User,
  Tag,
  Download,
  Share2,
  BookmarkPlus,
  Heart,
  Eye,
  ThumbsUp,
  MessageCircle,
  Play,
  FileText,
  Video,
  FileDown,
  ExternalLink,
  Calendar,
  Sparkles,
  Coffee,
  Star,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Resource } from '../types';

gsap.registerPlugin(ScrollTrigger);

export default function ResourceDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Mock resource data - replace with Supabase fetch
    const mockResource: Resource = {
      id: id || '1',
      title: 'The Ultimate Resume Guide for Tech Students',
      description: 'A comprehensive 45-page guide covering everything from ATS-friendly formatting to showcasing technical projects. Includes 10+ real resume examples from successful students who landed internships at top tech companies.',
      type: 'guide',
      category: 'resume',
      content: `# The Ultimate Resume Guide for Tech Students

## Table of Contents
1. Introduction to Tech Resumes
2. ATS-Friendly Formatting
3. Essential Sections for Tech Resumes
4. Showcasing Technical Projects
5. Highlighting Technical Skills
6. Education Section Best Practices
7. Work Experience (Even Without Tech Experience)
8. Common Mistakes to Avoid
9. Resume Templates and Examples
10. Next Steps and Resources

---

## 1. Introduction to Tech Resumes

Your resume is your first impression in the competitive tech industry. Unlike traditional resumes, tech resumes have unique requirements and expectations. This guide will help you create a standout resume that gets noticed by recruiters and hiring managers.

### Why Tech Resumes Are Different
- **Technical skills are paramount**: Your programming languages, frameworks, and tools matter more than generic skills
- **Projects showcase ability**: Personal and academic projects demonstrate your practical experience
- **ATS optimization is crucial**: Most tech companies use Applicant Tracking Systems to filter resumes
- **GitHub and portfolio links**: Your code and projects should be easily accessible

---

## 2. ATS-Friendly Formatting

Applicant Tracking Systems (ATS) scan your resume before human eyes see it. Here's how to optimize for ATS:

### Do's:
- Use standard fonts (Arial, Calibri, Times New Roman)
- Keep formatting simple and clean
- Use standard section headers
- Include keywords from the job description
- Save as both PDF and Word formats

### Don'ts:
- Avoid tables, columns, or complex layouts
- Don't use images, graphics, or logos
- Avoid fancy fonts or excessive styling
- Don't use headers or footers for important information

---

## 3. Essential Sections for Tech Resumes

### Contact Information
- Full name and professional email
- Phone number
- LinkedIn profile URL
- GitHub profile URL
- Portfolio website (if applicable)
- Location (city, state)

### Professional Summary (2-3 lines)
Example: "Computer Science student with experience in full-stack development and machine learning. Proficient in Python, JavaScript, and React. Seeking software engineering internship to apply problem-solving skills and contribute to innovative projects."

### Technical Skills
Organize by category:
- **Programming Languages**: Python, JavaScript, Java, C++
- **Frameworks/Libraries**: React, Node.js, Express, Django
- **Tools/Technologies**: Git, Docker, AWS, MongoDB
- **Concepts**: Data Structures, Algorithms, OOP, Agile

### Education
- University name and location
- Degree and major
- Expected graduation date
- GPA (if 3.5 or higher)
- Relevant coursework
- Academic achievements

### Projects
This is often the most important section for students:
- **Project Name** | GitHub Link | Live Demo (if applicable)
- Brief description (1-2 lines)
- Technologies used
- Key achievements or metrics

### Experience
Include internships, part-time work, research, or volunteer experience:
- Job title and company
- Dates of employment
- 2-3 bullet points describing responsibilities and achievements
- Quantify results when possible

---

## 4. Showcasing Technical Projects

Projects are your chance to demonstrate practical skills. Here's how to present them effectively:

### Project Selection
Choose 3-4 projects that:
- Show different technologies
- Demonstrate problem-solving
- Have clean, documented code
- Include live demos when possible

### Project Description Format
**E-Commerce Web Application** | [GitHub](link) | [Live Demo](link)
- Built full-stack e-commerce platform using React, Node.js, and MongoDB
- Implemented user authentication, shopping cart, and payment processing
- Deployed on AWS with 99.9% uptime and optimized for mobile devices
- **Tech Stack**: React, Node.js, Express, MongoDB, Stripe API, AWS

### Types of Projects to Include
- **Web Applications**: Full-stack projects showing front-end and back-end skills
- **Mobile Apps**: iOS/Android applications
- **Data Science Projects**: Machine learning models, data analysis
- **Open Source Contributions**: Contributions to existing projects
- **Hackathon Projects**: Time-constrained projects showing rapid development

---

## 5. Highlighting Technical Skills

### Skill Categories
Organize skills by proficiency and relevance:

**Proficient**: Skills you use regularly and confidently
**Familiar**: Skills you've used but aren't expert-level
**Learning**: Skills you're currently developing

### How to List Skills
- Be specific (React.js vs "web development")
- Include version numbers for important technologies
- Mention years of experience for key skills
- Keep the list relevant to your target role

### Skills to Include
- Programming languages
- Frameworks and libraries
- Databases
- Cloud platforms
- Development tools
- Methodologies (Agile, Scrum)

---

## 6. Education Section Best Practices

### What to Include
- University name and location
- Degree type and major
- Expected graduation date
- GPA (if 3.5 or higher)
- Relevant coursework
- Academic projects
- Honors and awards

### Relevant Coursework Example
**Relevant Coursework**: Data Structures & Algorithms, Database Systems, Software Engineering, Computer Networks, Machine Learning, Web Development

### Academic Projects
Treat significant academic projects like professional projects:
- Course project that solved a real problem
- Capstone or senior design project
- Research projects with professors

---

## 7. Work Experience (Even Without Tech Experience)

### For Students with Limited Experience
- Focus on transferable skills
- Highlight leadership and teamwork
- Show problem-solving abilities
- Demonstrate work ethic and reliability

### Formatting Work Experience
**Job Title** | Company Name | Location | Dates
- Bullet point describing responsibility and achievement
- Quantify results when possible (increased sales by 20%)
- Use action verbs (developed, implemented, optimized)

### Transferable Skills Examples
- **Customer Service**: Communication and problem-solving
- **Retail**: Working under pressure and multitasking
- **Tutoring**: Teaching and mentoring abilities
- **Research Assistant**: Data analysis and attention to detail

---

## 8. Common Mistakes to Avoid

### Content Mistakes
- Generic objective statements
- Listing every technology you've ever touched
- Including irrelevant experience
- Typos and grammatical errors
- Inconsistent formatting

### Technical Mistakes
- Broken GitHub links
- Private repositories
- Poorly documented code
- Non-functional live demos
- Outdated portfolio

### Formatting Mistakes
- Too long (more than 1 page for students)
- Hard to read fonts
- Inconsistent spacing
- Poor use of white space
- Unprofessional email address

---

## 9. Resume Templates and Examples

### Template 1: Computer Science Student
[Detailed template with sections properly formatted]

### Template 2: Web Development Focus
[Template emphasizing front-end and back-end skills]

### Template 3: Data Science Student
[Template highlighting analytics and machine learning]

### Real Examples
- Software Engineering Intern at Google
- Data Science Intern at Microsoft
- Full-Stack Developer at Startup
- Mobile App Developer

---

## 10. Next Steps and Resources

### Action Items
1. **Update your GitHub**: Clean up repositories and add READMEs
2. **Build a portfolio**: Create a personal website showcasing projects
3. **Practice coding interviews**: Use LeetCode, HackerRank, or CodeSignal
4. **Network**: Attend career fairs and join tech communities
5. **Apply strategically**: Target companies and roles that match your skills

### Additional Resources
- **Resume Review Tools**: Jobscan, Resume Worded
- **Portfolio Inspiration**: GitHub Pages, Netlify, Vercel
- **Interview Preparation**: Cracking the Coding Interview, System Design Primer
- **Networking**: LinkedIn, Meetup, Discord communities
- **Job Boards**: AngelList, Glassdoor, company career pages

### Getting Feedback
- Career services at your university
- Peer review with classmates
- Online communities (Reddit r/cscareerquestions)
- Professional mentors or alumni

---

## Conclusion

Creating an effective tech resume is an iterative process. Start with a solid foundation, continuously update with new projects and skills, and always tailor your resume to specific roles and companies.

Remember: Your resume is a marketing document. It should tell a compelling story about your journey into tech and demonstrate your potential to contribute to a team.

Good luck with your job search! 🚀

---

*This guide is regularly updated to reflect current industry trends and best practices. Last updated: July 2024*`,
      author_id: 'admin-1',
      published: true,
      tags: ['resume', 'career', 'tech', 'students', 'guide', 'ATS', 'projects', 'formatting'],
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    };
    
    setResource(mockResource);

    // Mock related resources
    const mockRelated: Resource[] = [
      {
        id: '2',
        title: 'Cover Letter Templates for Tech Roles',
        description: 'Professional cover letter templates specifically designed for software engineering and tech positions.',
        type: 'template',
        category: 'resume',
        author_id: 'admin-2',
        published: true,
        tags: ['cover letter', 'templates', 'tech'],
        created_at: '2024-01-20T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z'
      },
      {
        id: '3',
        title: 'Technical Interview Preparation Guide',
        description: 'Comprehensive guide covering coding interviews, system design, and behavioral questions.',
        type: 'guide',
        category: 'interview',
        author_id: 'admin-1',
        published: true,
        tags: ['interview', 'coding', 'preparation'],
        created_at: '2024-01-25T00:00:00Z',
        updated_at: '2024-01-25T00:00:00Z'
      }
    ];
    
    setRelatedResources(mockRelated);
  }, [id]);

  useEffect(() => {
    if (!resource) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Content animation
      gsap.fromTo(contentRef.current, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
      });

      // Related resources animation
      gsap.fromTo(relatedRef.current, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6
      });

      // Floating decorations
      gsap.to('.resource-decoration', {
        y: -15,
        x: 10,
        rotation: 360,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, [resource]);

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'template':
        return <FileDown className="h-6 w-6" />;
      case 'guide':
        return <BookOpen className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'template':
        return 'bg-green-100 text-green-800';
      case 'guide':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Add to Supabase bookmarks
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asu-maroon mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resource...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="resource-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="resource-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="resource-decoration absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="resource-decoration absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50" />
      <Heart className="resource-decoration absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/resources" 
          className="inline-flex items-center space-x-2 text-asu-maroon hover:text-asu-maroon-dark transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Resources</span>
        </Link>

        {/* Header */}
        <div ref={headerRef} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm`}>
                  {getResourceTypeIcon(resource.type)}
                  <span className="font-semibold text-white capitalize">{resource.type}</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <Tag className="h-5 w-5" />
                  <span className="font-semibold text-white capitalize">{resource.category.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBookmark}
                  className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <BookmarkPlus className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
            <p className="text-xl text-white/90 mb-6">{resource.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <User className="h-4 w-4" />
                <span>ASU Career Services</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="h-4 w-4" />
                <span>Updated {new Date(resource.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Eye className="h-4 w-4" />
                <span>1,234 views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {resource.content}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {resource.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-asu-maroon/10 text-asu-maroon rounded-full text-sm font-medium hover:bg-asu-maroon/20 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Resources */}
        <div ref={relatedRef} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedResources.map((relatedResource) => (
                <Link
                  key={relatedResource.id}
                  to={`/resources/${relatedResource.id}`}
                  className="block p-6 border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${getResourceTypeColor(relatedResource.type)}`}>
                      {getResourceTypeIcon(relatedResource.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{relatedResource.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{relatedResource.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(relatedResource.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Share Resource</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-xl bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(window.location.href)}
                    className="px-4 py-3 bg-asu-maroon text-white rounded-xl hover:bg-asu-maroon-dark transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <span>📧</span>
                  <span>Email</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <span>📱</span>
                  <span>LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}