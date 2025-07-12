import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import './HowItWorks.css';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const stepsRef = useRef([]);

  const steps = [
    {
      number: "01",
      icon: <PlayArrowIcon />,
      title: "Step: 1, 2",
      description: "Start the bot and find a quiet place for 8-12 minutes. Imagine that you're taking the IELTS speaking exam",
      category: "start"
    },
    {
      number: "02", 
      icon: <EditNoteIcon />,
      title: "Step: 3, 4",
      description: "At part 2, take some notes over a minute to brainstorm your ideas to speak for 2 minutes, bot will notify you when to record your answers",
      category: "practice"
    },
    {
      number: "03",
      icon: <AssessmentIcon />,
      title: "Step: 5, 6", 
      description: "After finishing all 3 parts, AI will take 1-2 minutes to evaluate your speech and provide clear feedback.",
      category: "feedback"
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const steps = stepsRef.current;

    // Title animation
    ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      animation: gsap.fromTo(title,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      )
    });

    // Steps stagger animation
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      animation: gsap.fromTo(steps,
        { opacity: 0, y: 80 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        }
      )
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="how-it-works" className="how-it-works" ref={sectionRef}>
      <div className="container">
        <h2 ref={titleRef}>How does it work?</h2>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="step material-card"
              ref={el => stepsRef.current[index] = el}
            >
              <div className="step-header">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
              </div>
              <div className={`category-badge category-${step.category}`}>
                {step.category}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;