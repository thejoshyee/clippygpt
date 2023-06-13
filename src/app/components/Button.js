import PropTypes from 'prop-types';

const Button = ({ children, handleClick, isDisabled }) => {
  return (
    <button className="submit-btn" type="submit" disabled={isDisabled} onClick={handleClick}>
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