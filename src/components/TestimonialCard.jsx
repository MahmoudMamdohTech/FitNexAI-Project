import React from 'react';

const TestimonialCard = ({ name, role, text, img }) => {
  return (
    <div className="testimonial-card">
      <p className="testimonial-quote">
        "{text}"
      </p>
      <div className="testimonial-user">
        <img src={img} alt={name} />
        <div className="testimonial-info">
          <h4>{name}</h4>
          <p>{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
