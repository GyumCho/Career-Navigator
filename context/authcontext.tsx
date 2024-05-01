import { createContext } from 'react';
import { AuthAction, authReducer, AuthState, INITIAL_AUTH_STATE } from "./reducer";
import React from 'react';

const AuthStateContext = createContext<AuthState>(INITIAL_AUTH_STATE);
const AuthDispatchContext = createContext<React.Dispatch<AuthAction> | undefined>(undefined);

const AuthProvider = ({ children }: any) => {
	const [authState, dispatch] = React.useReducer(authReducer, INITIAL_AUTH_STATE);

	return (
    <AuthStateContext.Provider value={authState}>
        <AuthDispatchContext.Provider value={dispatch}>
            {children}
        </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

function useAuthState() {
    const context = React.useContext(AuthStateContext);
    if (context === undefined) {
      throw new Error('useAuthState must be used within a AuthProvider');
    }
    return context;
  }
  function useAuthDispatch() {
    const context = React.useContext(AuthDispatchContext);
    if (context === undefined) {
      throw new Error('useAuthDispatch must be used within a AuthProvider');
    }
    return context;
  }

export {AuthProvider, useAuthState, useAuthDispatch};


