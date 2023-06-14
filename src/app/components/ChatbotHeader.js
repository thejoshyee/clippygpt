import Image from 'next/image';
import { getDatabase, ref, remove } from 'firebase/database';
import PropTypes from 'prop-types';
import styles from 'src/app/styles/ChatbotHeader.module.css';

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
    <div className={styles.chatbotHeader}>
      <div className={styles.logoContainer}>
        <Image src="/images/clippy-logo-1.png" width={20} height={20} alt="logo" className={styles.logo} />
        <div className={styles.titleContainer}>
          <h1 className={styles.h1}>ClippyGPT</h1>
          <h2 className={styles.h2}>The Ultimate AI Teaching Assistant</h2>
        </div>
      </div>
      <div className={styles.headerRight}>      
        <p className={styles.supportId}>User ID: 12345</p>
        <button onClick={handleReset} className={styles.clearBtn} id="clear-btn">Reset</button>
      </div>
    </div>
  );
};

ChatbotHeader.propTypes = {
  onReset: PropTypes.func.isRequired,
};

export default ChatbotHeader;