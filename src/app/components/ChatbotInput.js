import Button from './Button';
import Image from 'next/image';
import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from 'src/app/styles/ChatbotInput.module.css';

const loadingIcon = '/images/loading.svg';

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
    <div className={styles.inputWrapper}>
      {isLoading ? (
        <div className={styles.loadingIconWrapper}>
          <Image src={loadingIcon} height={20} width={20} alt="loading" />
        </div>
      ) : (
        <div className={styles.loadingIconPlaceholder} />
      )}
      <form onSubmit={handleSubmit} className={styles.chatbotInputForm}>
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
            if (e.key === 'Enter' && isLoading) {
              e.preventDefault();
            }
          }}
        />
        <Button type="submit" id="submit-btn" className={styles.submitBtn}>
          <Image
            src="/images/arrow-right-circle.svg"
            className={styles.sendBtnIcon}
            height={20}
            width={20}
            alt="send"
          />
        </Button>
      </form>
    </div>
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
