import styled from 'styled-components';
import Button from './Button';
import Image from 'next/image';
import { useState } from 'react';
import PropTypes from 'prop-types';


const ChatbotInputForm = styled.form`
  display: flex;
  position: relative;
  padding-bottom: 1em;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;

  input[type="text"],
  button {
    background-color: transparent;
    border: 1px solid var(--medium-light-text);
    border-radius: 15px;
    padding: 1em;
  }

  input[type="text"] {
    color: #fcfcfc;
    width: 100%;
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #e6e6e6;
      font-style: italic;
    }
  }

  .submit-btn {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .send-btn-icon {
    width: 20px;
    display: block;
  }
`;


const ChatbotInput = ({
  fetchReply,
  isLoading,
  setConversationArr,
  setIsLoading,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
  
    if (message) {
      setConversationArr((prevConversation) => [
        ...prevConversation,
        { role: 'user', content: message },
      ]);
  
      setIsLoading(true);
      await fetchReply(message);
      setInputValue('');
      setIsLoading(false);
    }
    
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <ChatbotInputForm onSubmit={handleSubmit}>
      <input
        name="user-input"
        type="text"
        id="user-input"
        placeholder={isLoading ? 'Clippy is thinking...' : 'Type your message here'}
        required
        value={inputValue}
        onChange={handleChange}
        autoComplete="off"
        onKeyDown={(e) => {
          // Prevent form submission when Enter key is pressed and isLoading is true
          if (e.key === 'Enter' && isLoading) {
            e.preventDefault();
          }
        }}
      />
      <Button type="submit" id="submit-btn" className="submit-btn">
        <Image
          src="/images/arrow-right-circle.svg"
          className="send-btn-icon"
          height={20}
          width={20}
          alt="send"
        />
      </Button>
    </ChatbotInputForm>
  );
};

ChatbotInput.propTypes = {
  fetchReply: PropTypes.func,
  handleSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  inputValue: PropTypes.string,
  handleChange: PropTypes.func,
  setConversationArr: PropTypes.func,
  setIsLoading: PropTypes.func,
};

export default ChatbotInput;

