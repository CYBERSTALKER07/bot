import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Hero from './Hero';
import ReactDemo from './ReactDemo';
import HowItWorks from './HowItWorks';
import Product from './Product';
import Assessment from './Assessment';
import Audience from './Audience';
import Users from './Users';
import Pricing from './Pricing';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <ReactDemo />
      <HowItWorks />
      <Product />
      <Assessment />
      <Audience />
      <Users />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;