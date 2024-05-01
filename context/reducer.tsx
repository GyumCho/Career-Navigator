export type AuthAction = {
  type: 'RESTORE_TOKEN',
  token: string,
  isMentor: boolean,
} | {
  type: 'SIGN_UP',
  token: string,
  isMentor: boolean,
} | {
  type: 'SIGN_IN',
  token: string,
  isMentor: boolean,
} | {
  type: 'SIGN_OUT',
};

export type AuthState = {
  userToken: string | undefined,
  isSignout: boolean,
  firstTime: boolean,
  isMentor: boolean,
};

export const INITIAL_AUTH_STATE: AuthState = {
  userToken: undefined,
  isSignout: false,
  firstTime: true,
  isMentor: false,
};

export const authReducer = (prevState: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          userToken: action.token,
          isMentor: action.isMentor,
          firstTime: false,
          isSignout: false,
        };
      case 'SIGN_UP':
        return {
          isMentor: action.isMentor,
          isSignout: false,
          userToken: action.token,
          firstTime: true,
        };
      case 'SIGN_IN':
        return {
          isMentor: action.isMentor,
          isSignout: false,
          userToken: action.token,
          firstTime: false,
        };
      case 'SIGN_OUT':
        return {
          userToken: undefined,
          isSignout: true,
          firstTime: false,
          isMentor: false,
        };
      default:
        return prevState;
    }
};
