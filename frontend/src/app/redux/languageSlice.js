import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialLanguage = Cookies.get('i18next') || 'en';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    language: initialLanguage,
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      Cookies.set('i18next', action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
