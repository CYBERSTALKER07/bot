import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TranslateIcon from '@mui/icons-material/Translate';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import GradingIcon from '@mui/icons-material/Grading';
import './Assessment.css';

gsap.registerPlugin(ScrollTrigger);

const Assessment = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const achievementsRef = useRef([]);

  const assessments = [
    {
      id: 1,
      name: "Salikhov Amir",
      location: "Uzbekistan",
      overallScore: "7.5",
      band: "Good User",
      scores: {
        fluency: "8.0",
        vocabulary: "7.5", 
        grammar: "7.5",
        pronunciation: "7.5"
      },
      feedback: "The candidate demonstrates strong fluency and natural expression. Shows good command of complex grammatical structures with minor errors. Vocabulary is varied and appropriate for the context.",
      strengths: ["Excellent fluency", "Natural intonation", "Complex sentence structures"],
      improvements: ["Reduce minor pronunciation errors", "Expand formal vocabulary", "Practice linking words"],
      testDate: "July 2025"
    },
    {
      id: 2,
      name: "Mardonova Mubina", 
      location: "Uzbekistan",
      overallScore: "6.0",
      band: "Competent User",
      scores: {
        fluency: "6.0",
        vocabulary: "6.0",
        grammar: "6.5", 
        pronunciation: "5.5"
      },
      feedback: "The candidate shows good overall competence with some hesitation. Grammar is generally accurate but vocabulary could be more varied. Pronunciation needs improvement for clarity.",
      strengths: ["Good grammar control", "Clear communication", "Relevant responses"],
      improvements: ["Reduce hesitation", "Expand vocabulary range", "Work on pronunciation clarity"],
      testDate: "July 2025"
    }
  ];

  const assessmentCriteria = [
    {
      icon: <RecordVoiceOverIcon />,
      title: "Fluency and Coherence",
      description: "Evaluates your ability to speak smoothly and logically organize your ideas",
      score: "7.5",
      maxScore: "9.0",
      percentage: 83,
      details: "Speech rate and rhythm, logical sequencing of ideas, range of connectives and discourse markers",
      tips: ["Practice speaking at a natural pace", "Use linking words effectively", "Organize ideas logically"]
    },
    {
      icon: <TranslateIcon />,
      title: "Lexical Resource",
      description: "Assesses your vocabulary range, accuracy, and appropriateness",
      score: "7.0",
      maxScore: "9.0",
      percentage: 78,
      details: "Vocabulary range, accuracy in word choice, and appropriateness for context",
      tips: ["Expand academic vocabulary", "Use precise word choices", "Avoid repetition"]
    },
    {
      icon: <TextFieldsIcon />,
      title: "Grammatical Range and Accuracy",
      description: "Measures your use of grammar structures and accuracy",
      score: "6.5",
      maxScore: "9.0",
      percentage: 72,
      details: "Range of structures, accuracy in grammar usage, and complexity of language",
      tips: ["Practice complex sentence structures", "Review common grammar errors", "Use varied sentence patterns"]
    },
    {
      icon: <GradingIcon />,
      title: "Pronunciation",
      description: "Evaluates your pronunciation, intonation, and clarity",
      score: "7.0",
      maxScore: "9.0",
      percentage: 78,
      details: "Individual sounds, word stress, sentence stress, and intonation patterns",
      tips: ["Practice word stress patterns", "Work on natural intonation", "Focus on clear articulation"]
    }
  ];

  useEffect(() => {
    const title = titleRef.current;
    const cards = cardsRef.current;

    // Title animation
    ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      animation: gsap.fromTo(title,
        { opacity: 0, y: 50, rotationX: 30 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: "power3.out" }
      )
    });

    // Cards stagger animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      animation: gsap.fromTo(cards,
        { opacity: 0, y: 100, scale: 0.8, rotationY: 45 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out"
        }
      )
    });

    // Hover animations for cards
    cards.forEach((card) => {
      if (card) {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.02,
            y: -8,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="assessment" className="assessment" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 ref={titleRef}>Real Assessment Results</h2>
          <p className="section-subtitle">See how IELTS Speak provides detailed, personalized feedback to help candidates improve their speaking skills</p>
        </div>
        
        <div className="assessments-grid">
          {assessments.map((assessment, index) => (
            <div 
              key={assessment.id} 
              className="assessment-card"
              ref={el => cardsRef.current[index] = el}
            >
              <div className="card-header">
                <div className="candidate-info">
                  <h3>{assessment.name}</h3>
                  <span className="location">📍 {assessment.location}</span>
                  <span className="test-date">📅 {assessment.testDate}</span>
                </div>
                <div className="overall-score-container">
                  <div className="overall-score">{assessment.overallScore}</div>
                  <span className="band-level">{assessment.band}</span>
                </div>
              </div>
              
              <div className="scores-section">
                <h4>Detailed Scores</h4>
                <div className="scores-grid">
                  <div className="score-item">
                    <span className="score-label">Fluency & Coherence</span>
                    <span className="score-value">{assessment.scores.fluency}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Lexical Resource</span>
                    <span className="score-value">{assessment.scores.vocabulary}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Grammar Range</span>
                    <span className="score-value">{assessment.scores.grammar}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Pronunciation</span>
                    <span className="score-value">{assessment.scores.pronunciation}</span>
                  </div>
                </div>
              </div>

              <div className="feedback-section">
                <h4>AI Feedback</h4>
                <p>{assessment.feedback}</p>
              </div>

              <div className="insights-section">
                <div className="strengths">
                  <h5>✅ Strengths</h5>
                  <ul>
                    {assessment.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="improvements">
                  <h5>🎯 Areas for Improvement</h5>
                  <ul>
                    {assessment.improvements.map((improvement, idx) => (
                      <li key={idx}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="criteria-section">
          <h4>IELTS Speaking Assessment Criteria</h4>
          <p className="section-subtitle">
            Understand how your speaking performance is evaluated across four key areas. 
            Each criterion contributes equally to your overall band score.
          </p>
          <div className="criteria-grid">
            {assessmentCriteria.map((criteria, idx) => (
              <div 
                key={idx} 
                className="criteria-item"
                ref={el => achievementsRef.current[idx] = el}
              >
                <div className="criteria-icon">
                  {criteria.icon}
                </div>
                <div className="criteria-content">
                  <h5>{criteria.title}</h5>
                  <p className="criteria-description">{criteria.description}</p>
                  
                  <div className="criteria-score">
                    <span className="score-label">Current Score:</span>
                    <span className="score-value">{criteria.score}</span>
                  </div>
                  
                  <div className="score-progress">
                    <div 
                      className="score-fill" 
                      style={{ width: `${criteria.percentage}%` }}
                    ></div>
                  </div>
                  
                  <p className="criteria-details">{criteria.details}</p>
                  
                  <div className="improvement-tips">
                    <h6>💡 Improvement Tips:</h6>
                    <ul>
                      {criteria.tips.map((tip, tipIdx) => (
                        <li key={tipIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="score-comparison">
            <h5>Band Score Requirements</h5>
            <div className="band-scale">
              {[
                { band: "9.0", label: "Expert", color: "#4CAF50" },
                { band: "8.0", label: "Very Good", color: "#8BC34A" },
                { band: "7.0", label: "Good", color: "#FF9800" },
                { band: "6.0", label: "Competent", color: "#FF5722" },
                { band: "5.0", label: "Modest", color: "#F44336" }
              ].map((level, idx) => (
                <div key={idx} className="band-level-item">
                  <div 
                    className="band-circle" 
                    style={{ backgroundColor: level.color }}
                  >
                    {level.band}
                  </div>
                  <span className="band-label">{level.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="cta-section">
          <h3>Ready to Get Your Assessment?</h3>
          <p>Experience detailed AI-powered feedback on your IELTS speaking performance</p>
          <button 
            className="assessment-cta-button"
            onClick={() => window.open('https://t.me/IELTSPEAK_bot', '_blank')}
          >
            Start Your Assessment
          </button>
        </div>
      </div>
    </section>
  );
};

export default Assessment;