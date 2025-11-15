import { call, put, takeLatest } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  rehydrate,
} from "./authSlice";
import { LoginResponse } from "@/types/auth";
import authService from "@/services/authService";

// Saga de login
function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const { email, password } = action.payload;
    const response: LoginResponse = yield call(
      [authService, authService.login],
      email,
      password
    );

    yield put(loginSuccess({ user: response.user, token: response.token }));
  } catch (error: any) {
    yield put(loginFailure(error.message || "Erro ao fazer login"));
  }
}

// Saga de logout
function* handleLogout() {
  yield call([authService, authService.logout]);
}

// Reidratar sessão (usuário continua logado ao recarregar a página)
function* handleRehydrate() {
  const token = authService.getToken();
  const user = authService.getUser();

  if (token && user) {
    yield put(
      rehydrate({
        isAuthenticated: true,
        user,
        token,
      })
    );
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logout.type, handleLogout);
  yield call(handleRehydrate);
}
