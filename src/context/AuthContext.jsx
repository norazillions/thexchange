import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState, useCreateUserWithEmailAndPassword,useSignInWithEmailAndPassword,useSignOut} from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import { getFriendlyFirebaseError } from '../helpers/firebase-errors';
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const [
    createUserWithEmailAndPassword,
    creatingUser,
    createError
  ] = useCreateUserWithEmailAndPassword(auth);
  
  const [
    signInWithEmailAndPassword,
    signingIn,
    signInError
  ] = useSignInWithEmailAndPassword(auth);
  
  const [signOut, signingOut, signOutError] = useSignOut(auth);
  const isLoading = loading || creatingUser || signingIn || signingOut;
  const signUp = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(email, password);
      
      if (!result) {
        throw new Error('Failed to create account');
      }
      
      return result;
    } catch (error) {
      const friendlyMessage = getFriendlyFirebaseError(error.code);
      throw new Error(friendlyMessage);
    }
  };
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(email, password);
      
      if (!result) {
        throw new Error('Failed to sign in');
      }
      
      return result;
    } catch (error) {
      const friendlyMessage = getFriendlyFirebaseError(error.code);
      throw new Error(friendlyMessage);
    }
  };
  const handleSignOut = async () => {
    try {
      const result = await signOut();
      
      if (!result) {
        throw new Error('Failed to sign out');
      }
      
      return result;
    } catch (error) {
      const friendlyMessage = getFriendlyFirebaseError(error.code);
      throw new Error(friendlyMessage);
    }
  };
  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return auth.currentUser;
    }
    return null;
  };
  const value = {
    user,
    loading: isLoading,
    error: error || createError || signInError || signOutError,
    signUp,
    signIn,
    handleSignOut,
    reloadUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};