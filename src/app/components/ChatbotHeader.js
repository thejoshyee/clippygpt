import Image from 'next/image';
import { getDatabase, ref, remove } from 'firebase/database';
import PropTypes from 'prop-types';
import styles from 'src/app/styles/ChatbotHeader.module.css';

const ChatbotHeader = ({ onReset, user, handleSignOut }) => {
  const db = getDatabase();
  const userConversationRef = ref(db, `conversations/${user?.uid}`);

  const handleReset = () => {
    remove(userConversationRef)
      .then(() => {
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
        {user ? <><><p className={styles.supportId}><b>Username: </b>{user.displayName ? user.displayName : user.email}</p>
          <button onClick={handleSignOut} className={styles.signOutBtn} id="clear-btn">Sign Out</button></>
        <button onClick={handleReset} className={styles.clearBtn} id="clear-btn">Reset</button></> : ''
        }
      </div>
    </div>
  );
};

ChatbotHeader.propTypes = {
  onReset: PropTypes.func.isRequired,
  user: PropTypes.object,
  handleSignOut: PropTypes.func
};

export default ChatbotHeader;