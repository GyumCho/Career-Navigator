import React, { useCallback, useEffect, useReducer } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { ApiError } from "../api";
import { doRefresh } from "./auth.ts";

type ApiRequestStateInitial = {state: 'initial'};
type ApiRequestStateFetching = {state: 'fetching'};
type ApiRequestStateSuccess<T> = {state: 'success', response: T};
type ApiRequestStateError = {state: 'error', error: Error};

/**
 * The state of the request.
 *
 * The initial state only happens directly after construction. Once the first
 * trigger is happened, it will never return to the initial state.
 * After trigger, the state will become 'fetching', and after it is done, it
 * will go to the 'success' state containing a result, or go to the 'error'
 * state, and provide you with an error.
 */
export type ApiRequestState<T> = ApiRequestStateInitial
  | ApiRequestStateFetching
  | ApiRequestStateSuccess<T>
  | ApiRequestStateError
  ;

function allStatesAreSuccess<T extends any[]>(states: {[Index in keyof T]: ApiRequestState<T[Index]>}): states is {[Index in keyof T]: ApiRequestStateSuccess<T[Index]>} {
  return states.every(state => state.state === "success");
}

export function hoistRequestStates<T extends any[]>(...args: {[Index in keyof T]: ApiRequestState<T[Index]>}):
  ApiRequestStateSuccess<T> | ApiRequestStateError | ApiRequestStateFetching {
  if (allStatesAreSuccess<T>(args)) {
    return {
      state: "success",
      response: args.map(a => a.response) as T,
    };
  } else {
    let error = (args.find(v => v.state === "error") as ApiRequestStateError);
    if (error) {
      return error;
    } else {
      return {
        state: "fetching",
      };
    }
  }
}

/**
 * A trigger function that causes an API request to happen (again).
 */
export type TriggerApiRequest<A extends any[]> = (...args: A) => Promise<void>;

/**
 * Wrap an API request function so that it functions nicely in the React
 * ecosystem.
 *
 * @param request The function that constructs a response promise
 * @template T The response type of the API call
 * @template A The arguments to pass to the request function
 * @return a tuple containing
 *   the state of the request (see {@link ApiRequestState}),
 *   and a function to trigger the request (see {@link TriggerApiRequest}).
 * @see useEffect
 * @see ApiRequestState
 * @see TriggerApiRequest
 */
export function useApi<T, A extends any[]>(request: (...args: A) => Promise<T>):
    [ApiRequestState<T>, TriggerApiRequest<A>] {
  /**
   * The actions that can be dispatched to the encapsulated reducer.
   */
  type Action = {
    type: 'onResult',
    response: T,
  } | {
    type: 'onError',
    error: Error,
  } | {
    type: 'onStart',
  };

  /**
   * The reducer, to alter the state of the request.
   * @param _state is ignored
   * @param action contains the curent state transition information
   */
  const reducer = (_state: ApiRequestState<T>, action: Action): ApiRequestState<T> => {
    if (action.type === 'onStart') {
      return {
        state: 'fetching',
      };
    } else if (action.type === 'onResult') {
      return {
        state: 'success',
        response: action.response,
      };
    } else {
      // action.type == 'onError'
      return {
        state: 'error',
        error: action.error,
      };
    }
  };

  // Construct the actual reducer in the initial state.
  const [state, dispatch] = useReducer(reducer, {state: 'initial'});

  // Wrap the callback for good use in a component.
  const callback = useCallback(
    async (...args: A) => {
      try {
        dispatch({type: 'onStart'});
        const response = await request(...args);
        dispatch({type: 'onResult', response});
      } catch (error: any) {
        if (error instanceof ApiError && error.message === 'Unauthorized') {
          try {
            await doRefresh();
            const response = await request(...args);
            dispatch({type: 'onResult', response});
            return;
          } catch (retryError: any) {
            dispatch({type: 'onError', error: retryError});
            return;
          }
        }
        dispatch({type: 'onError', error});
      }
    },
    [request]
  );

  return [
    state,
    callback,
  ];
}

/**
 * Wrap an API request function so that it works nicely in the React
 * ecosystem.
 * As opposed to {@link useApi}, this function immediately executes the
 * request.
 *
 * @param request The request function to use
 * @param args the arguments to pass to the request function
 * @template T The response type of the API call
 * @template A The arguments to pass to the request function
 * @return a tuple containing
 *   the state of the request (see {@link ApiRequestState}),
 *   and a function to re-trigger the request (see {@link TriggerApiRequest}).
 * @see useEffect
 * @see ApiRequestState
 * @see TriggerApiRequest
 * @see useApi
 */
export function useApiImmediate<T, A extends any[]>(request: (...args: A) => Promise<T>, ...args: A):
    [ApiRequestState<T>, TriggerApiRequest<[]>] {
  const [state, doRequest] = useApi(request);

  useEffect(() => {
    (async () => {
      await doRequest(...args);
    })().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doRequest, ...args]);

  return [state, () => doRequest(...args)];
}

export async function doApiRequest<R, A extends any[]>(request: (...args: A) => R, ...args: A): Promise<R> {
  try {
    return await request(...args);
  } catch (error: any) {
    if (error instanceof ApiError && error.message === 'Unauthorized') {
      try {
        await doRefresh();
        return await request(...args);
      } catch (retryError: any) {
      }
    }
    throw error;
  }
}

export const ErrorView: React.FC<{error: Error, style?: StyleProp<ViewStyle>}> = ({error, style}) => {
  return <View style={{...styles.container, ...((style as any) || {})}}>
    <Text style={styles.errorTextHeader}>Error loading profile information!</Text>
    <Text style={styles.errorText}>Cause: { error.name }</Text>
    <Text style={styles.errorText}>{ error.message }</Text>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  errorTextHeader: {
    color: 'red',
  },
  errorText: {
    color: 'white',
  },
});
