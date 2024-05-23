import './globals.css';
import PropTypes from 'prop-types';

export const metadata = {
  title: 'ClippyGPT - The ultimate AI Teaching Assistant',
  description: 'The ultimate AI Teaching Assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
};