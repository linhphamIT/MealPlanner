
import React, { useState } from 'react';
import { submitFeedback } from '../../api/feedbackApi';

const FeedbackForm = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [improvement, setImprovement] = useState<string>('');

  const handleRating = (newRating: number) => {
    setRating(newRating);
  };

  const handleImprovement = (newImprovement: string) => {
    setImprovement(newImprovement);
  };

  const handleSubmit = async () => {
    if (rating) {
      await submitFeedback({ rating, improvement });
      // Optionally, reset the form or show a success message
      setRating(null);
      setImprovement('');
    }
  };

  return (
    <div>
      <h2>How satisfied are you with this plan? (1–5)</h2>
      <div>
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} onClick={() => handleRating(value)}>
            {value}
          </button>
        ))}
      </div>
      {rating && rating <= 3 && (
        <div>
          <h2>What should we improve?</h2>
          {[
            'More variety',
            'Simpler prep',
            'Different macros',
            'Budget',
            'Taste',
            'Other',
          ].map((value) => (
            <button key={value} onClick={() => handleImprovement(value)}>
              {value}
            </button>
          ))}
        </div>
      )}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FeedbackForm;
