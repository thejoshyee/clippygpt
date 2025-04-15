import PropTypes from 'prop-types';
import styles from '../styles/ChatbotInput.module.css';

const Button = ({ children, handleClick, isDisabled }) => {
  return (
    <button className={styles.submitBtn} type="submit" disabled={isDisabled} onClick={handleClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  handleClick: PropTypes.func,
  isDisabled: PropTypes.bool,
};

export default Button;