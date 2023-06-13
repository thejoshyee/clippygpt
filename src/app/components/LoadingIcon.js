import PropTypes from 'prop-types';
import styled from 'styled-components';

const LoadingIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  margin: 0 auto;
  padding-bottom: 1.5em;
`;

const LoadingIcon = ({ className }) => {
  return (
    <LoadingIconContainer className={className}>
      {/* <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL --> */}
      <svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="drop-shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feFlood floodColor="#fff" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="15" cy="15" r="15" fill="#fff" filter="url(#drop-shadow)">
          <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" />
          <animate attributeName="fillOpacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="15" r="9" fillOpacity="0.3" filter="url(#drop-shadow)">
          <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite" />
          <animate attributeName="fillOpacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
        </circle>
        <circle cx="105" cy="15" r="15" fill="#fff" filter="url(#drop-shadow)">
          <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" />
          <animate attributeName="fillOpacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
        </circle>
      </svg>
    </LoadingIconContainer>
  );
};

LoadingIcon.propTypes = {
  className: PropTypes.string
};

export default LoadingIcon;