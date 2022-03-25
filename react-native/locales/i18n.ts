import * as Localization from 'expo-localization'
import i18n from 'i18n-js'

import ko from './ko';
import en from './en';
import th from './th';
import km from './km';
import ja from './ja';
import vn from './vn';
import cn from './cn';

// Set the key-value pairs for the different languages
i18n.translations = {
    en,
    ko,
    ja,
    cn,
    km,
    vn,
    th,
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale.split("-")[0];
i18n.fallbacks = true;
