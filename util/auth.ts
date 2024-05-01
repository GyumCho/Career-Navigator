import { ApiError, OpenAPI, TokenService } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class InvalidCredentialsError extends Error {
}

export class NoRefreshTokenError extends Error {
}

export async function doLogin(username: string, password: string) {
  try {
    const result = await TokenService.tokenObtainPair({ username, password });
    OpenAPI.TOKEN = result.access;
    await AsyncStorage.setItem('refresh-token', result.refresh);
    return result;
  } catch (error) {
    if (error instanceof ApiError && error.message === "Unauthorized") {
      throw new InvalidCredentialsError();
    } else {
      throw error;
    }
  }
}

export async function needsRefresh(): Promise<boolean> {
  let token: string;
  if (typeof OpenAPI.TOKEN === 'string') {
    token = OpenAPI.TOKEN;
  } else if (typeof OpenAPI.TOKEN === 'function') {
    token = await OpenAPI.TOKEN({
      method: 'POST',
      url: '/api/token/verify',
    });
  } else {
    // No token is set.
    return true;
  }
  try {
    await TokenService.tokenVerify({ token });
  } catch (error) {
    // Token verify failed
    return true;
  }

  // Token is valid!
  return false;
}

export async function doRefresh() {
  const refreshToken = await AsyncStorage.getItem('refresh-token');
  if (!refreshToken) {
    throw new NoRefreshTokenError();
  }
  const result = await TokenService.tokenRefresh({refresh: refreshToken});
  OpenAPI.TOKEN = result.access || undefined;
  return result;
}

export async function logout() {
  OpenAPI.TOKEN = undefined;
  await AsyncStorage.removeItem('refresh-token');
}
