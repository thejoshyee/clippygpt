import PropTypes from 'prop-types';
import styles from 'src/app/styles/ChatbotContainer.module.css';

const ChatbotContainer = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
      <footer className={styles.footer}>&#169; Josh Yee {new Date().getFullYear()}</footer>
    </div>
  );
};

ChatbotContainer.propTypes = {
  children: PropTypes.node,
};

export default ChatbotContainer;