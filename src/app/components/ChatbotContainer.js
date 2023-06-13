import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  background-color: #314153;
  width: 100vw;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
  padding: 1em;

  footer {
    color: var(--medium-light-text);
    text-align: center;
    font-size: 12px;
    padding: 1em;
  }

  > * {
    padding: .5em;   
  } 
`;

const ChatbotContainer = ({ children }) => {
  return (
    <Container >
      {children}
      <footer className="footer">&#169;
Josh Yee 2023</footer>
    </Container>
  );
};

ChatbotContainer.propTypes = {
  children: PropTypes.node,
};
  


export default ChatbotContainer;