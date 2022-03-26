import * as Localization from 'expo-localization'
import i18n from 'i18n-js'

import en from './en';
import th from './th';
import km from './km';
import ja from './ja';
import vn from './vn';
import zh from './zh';
import ko from './ko';

import { useAuth } from '../contexts/Auth';

let locale = 'ko';

function handleLocale() {
    const auth = useAuth();

    if (auth?.userData?.ulanguage) {
        locale = auth.userData.ulanguage;
        if (locale=='zh') {
            locale = 'cn';
        }
        else if (locale=='vi') {
            locale = 'vn';
        }
    }
    else {
        locale = Localization.locale.split("-")[0];
    }
}

// Set the key-value pairs for the different languages
i18n.translations = {
    en,
    ko,
    ja,
    zh,
    km,
    vn,
    th,
};
// Set the locale once at the beginning of your app.
i18n.locale = locale;
i18n.fallbacks = true;
