import { useEffect } from 'react';
import { getAuth, EmailAuthProvider } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

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
        };

        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        ui.start('#firebaseui-auth-container', uiConfig);

        return () => {
          ui.delete().catch((error) => console.error('Error deleting FirebaseUI:', error));
        };
      }).catch((error) => console.error('Error importing firebaseui:', error));
    }
  }, []);

  return <div id="firebaseui-auth-container"></div>;
};

export default Auth;
