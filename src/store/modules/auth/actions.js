import { SIGNUP_URL, LOGIN_URL, API_KEY } from '../../../config.js';

export default {
  //LOGIN
  async login(context, payload) {
    context.dispatch('auth', {
      ...payload,
      mode: 'login',
    });
  },

  //SIGNUP
  async signup(context, payload) {
    context.dispatch('auth', {
      ...payload,
      mode: 'signup',
    });
  },

  async auth(context, payload) {
    const mode = payload.mode;
    let url = LOGIN_URL;

    if (mode === 'signup') {
      url = SIGNUP_URL;
    }

    const response = await fetch(`${url}?key=${API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate.'
      );
      throw error;
    }

    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);

    context.commit('setUser', {
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: responseData.expiresIn,
    });
  },

  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      context.commit('setUser', {
        token: token,
        userId: userId,
        tokenExpiration: null,
      });
    }
  },

  //LOGOUT
  logout(context) {
    context.commit('setUser', {
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  },
};
