import React, { useEffect, useRef } from 'react';
import TypeIt from 'typeit';
import propTypes from 'prop-types';

const TypewriterText = ({ text, onTypingDone, shouldAnimate }) => {
  const elementRef = useRef();
  const typeItInstance = useRef(null);

  useEffect(() => {
    typeItInstance.current = new TypeIt(elementRef.current, {
      speed: 20,
      lifeLike: true,
      cursor: true,
      breakLines: false,
      waitUntilVisible: true,
    });
  }, []);

  useEffect(() => {
    if (elementRef.current) {
      if (shouldAnimate) {
        typeItInstance.current
          .empty()
          .pause(500)
          .type(text)
          .exec(() => {
            onTypingDone();
          })
          .go();
      } else {
        elementRef.current.innerHTML = text;
      }
    }
  }, [text, onTypingDone, shouldAnimate]);

  return <div ref={elementRef} />;
};

TypewriterText.propTypes = {
  text: propTypes.string.isRequired,
  onTypingDone: propTypes.func,
  shouldAnimate: propTypes.bool,
};

export default TypewriterText;
