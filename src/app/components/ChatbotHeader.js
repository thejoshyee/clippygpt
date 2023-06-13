import styled from 'styled-components';
import Image from 'next/image';
import { getDatabase, ref, remove } from 'firebase/database';
import PropTypes from 'prop-types';


const HeaderContainer  = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1em;
  padding-right: 1em;

  .logo {
    width: 45px;
    height: auto;
    margin-right: 1em;
  }

  .logoContainer {
    display: flex;
    align-items: center;;
  }

  .supportId {
    font-size: 12px;
  }

  h1 {
    font-size: 24px;
    color: var(--light-text);
    margin: 0;

  }

  h2, p, .footer {
    color: var(--medium-light-text); 
  }

  h2 {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0;
  }

  .titleContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .clear-btn {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: var(--medium-light-text);
    font-size: 12px;
    margin: 0 auto; 
    align-items: center;    
    background-color: transparent;
    border: 1px solid var(--medium-light-text);
    border-radius: 15px;
    padding: 0.5em;
}

.clear-btn:hover {
    border: 1px solid #BC544B;
    background-color: #BC544B;
    color: #fff;
    cursor: pointer;
}

.headerRight {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
}
`;

const ChatbotHeader = ({ onReset }) => {

  const db = getDatabase();
  const conversationRef = ref(db);

  const handleReset = () => {
    remove(conversationRef)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Database cleared.');
        onReset();
      })
      .catch((error) => {
        console.error('Error clearing database:', error);
      });
  };


  return (
    <HeaderContainer className="chatbot-header">
      <div className="logoContainer">
        <Image src="/images/clippy-logo-1.png" width={20} height={20} alt="logo" className="logo" />
        <div className="titleContainer">
          <h1>ClippyGPT</h1>
          <h2>The Ultimate AI Teaching Assistant</h2>
        </div>
      </div>
      <div className="headerRight">      
        <p className="supportId">User ID: 12345</p>
        <button onClick={handleReset} className="clear-btn" id="clear-btn">Reset</button>
      </div>
    </HeaderContainer>
  );
};

ChatbotHeader.propTypes = {
  onReset: PropTypes.func.isRequired,
};

export default ChatbotHeader;