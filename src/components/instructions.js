import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import DocInstructions from '../doc/Poker-Tutorial.md';

const Instructions = () => {

  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    fetch(DocInstructions).then((response) => response.text()).then((text) => {
      setInstructions(text);
    });
  }, []);

  return (
    <div className="content">
      <ReactMarkdown source={instructions} />
    </div>
  );
};

export default Instructions;
