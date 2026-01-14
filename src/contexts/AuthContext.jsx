import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Usuario',
          picture: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=10b981&color=fff&size=128`,
          createdAt: firebaseUser.metadata.creationTime,
        };
        setUser(userData);
        localStorage.setItem('myday_user', JSON.stringify(userData));
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem('myday_user');
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      // Account linking happens automatically with Firebase
      // User info is automatically set by onAuthStateChanged listener
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);

      // Handle account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        setError('Este email ya está registrado con email/password. Inicia sesión con tu contraseña o vincula tu cuenta de Google.');
      } else {
        setError(error.message);
      }

      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Try to sign in with email/password
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
      } catch (signInError) {
        // If user not found, check if account exists with other provider
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          // Check if email exists with other providers
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);

          if (signInMethods.length > 0) {
            // Account exists with another provider
            if (signInMethods.includes('google.com')) {
              setError('Este email ya está registrado con Google. Por favor usa el botón "Con Google" para iniciar sesión.');
              setLoading(false);
              throw new Error('account-exists-with-google');
            }
          }

          // No account exists, create new one
          try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
          } catch (signUpError) {
            console.error('Error creating account:', signUpError);
            if (signUpError.code === 'auth/email-already-in-use') {
              setError('Este email ya está en uso');
            } else if (signUpError.code === 'auth/weak-password') {
              setError('La contraseña debe tener al menos 6 caracteres');
            } else {
              setError('Error al crear la cuenta');
            }
            setLoading(false);
            throw signUpError;
          }
        }

        // Other sign-in errors
        if (signInError.code === 'auth/wrong-password') {
          setError('Contraseña incorrecta');
        } else if (signInError.code === 'auth/invalid-email') {
          setError('Email inválido');
        } else {
          setError('Correo o contraseña incorrectos');
        }
        setLoading(false);
        throw signInError;
      }
    } catch (error) {
      console.error('Error in signInWithEmail:', error);
      if (!error.message?.includes('account-exists')) {
        setLoading(false);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear app data on logout
      localStorage.removeItem('myday_routines');
      localStorage.removeItem('myday_stats_history');
      localStorage.removeItem('myday_events');
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('myday_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
