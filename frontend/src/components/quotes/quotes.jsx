import React, { useEffect, useState } from 'react';
import { getMindfulnessQuote } from '../../services/apiServices';
import { QuoteCard } from './quotesStyled';

const Quotes = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      const data = await getMindfulnessQuote();
      if (data?.quote) {
        setQuote(data.quote);
      }
    };
    fetchQuote();
  }, []);

  return (
    <div>
      <QuoteCard>{quote}</QuoteCard>
    </div>
  );
};

export default Quotes;
