import { useEffect } from 'react';
import { getAuth, EmailAuthProvider } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';
import styled from 'styled-components';

const AuthContainer = styled.div`
  text-align: center;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;

  #firebaseui-auth-container {
    .firebaseui-container {
      max-width: 100%;
      width: 100%;
    }
    .firebaseui-card-content {
      padding: 1.5rem 2rem;
    }
    .firebaseui-card-header {
      display: none;
    }
  }
`;

const WelcomeText = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    color: #fcfcfc;
  }
  p {
    color: #fcfcfc;
    font-size: 1.1rem;
  }
`;

const Auth = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('firebaseui').then((firebaseui) => {
        const auth = getAuth();
        const uiConfig = {
          signInSuccessUrl: '/', 
          signInOptions: [
            {
              provider: EmailAuthProvider.PROVIDER_ID,
              requireDisplayName: true,
            },
          ],
          signInFlow: 'redirect',
          credentialHelper: firebaseui.auth.CredentialHelper.NONE,
          tosUrl: '/terms-of-service',
          privacyPolicyUrl: '/privacy-policy'
        };

        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        ui.start('#firebaseui-auth-container', uiConfig);

        return () => {
          ui.delete().catch((error) => console.error('Error deleting FirebaseUI:', error));
        };
      }).catch((error) => console.error('Error importing firebaseui:', error));
    }
  }, []);

  return (
    <AuthContainer>
      <WelcomeText>
        <h1>Welcome to ClippyGPT! 👋</h1>
        <p>Sign in or create an account to start chatting with your AI teaching assistant.</p>
      </WelcomeText>
      <div id="firebaseui-auth-container"></div>
    </AuthContainer>
  );
};

export default Auth;
