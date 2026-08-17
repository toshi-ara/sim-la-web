import i18n from "i18next";
import enJSON from "../locales/en.json";
import jaJSON from "../locales/ja.json";
import koJSON from "../locales/ko.json";
import zhTWJSON from "../locales/zh_TW.json";


i18n.init({
    lng: "en",
    fallbackLng: "en",
    resources: {
        en: { translation: enJSON },
        ja: { translation: jaJSON },
        ko: { translation: koJSON },
        "zh-TW": { translation: zhTWJSON },
    },
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
