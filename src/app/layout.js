import './globals.css';
// import { Inter } from 'next/font/google';
import PropTypes from 'prop-types';

// const inter = Inter({ subsets: ['latin'] });

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