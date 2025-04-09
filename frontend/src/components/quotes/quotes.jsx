import React, { useEffect, useState } from 'react';
import { QuoteWrapper, QuoteText } from './quotesStyled';

const QuoteBox = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Replace this with your quote API if needed
    setQuote("Even in dark times there is hope. Every ending is a new beginning");
  }, []);

  return (
    <QuoteWrapper>
      <QuoteText>{quote}</QuoteText>
    </QuoteWrapper>
  );
};

export default QuoteBox;
