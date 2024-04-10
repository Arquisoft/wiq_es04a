import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es_translation from "./es.json";
import en_translation from "./en.json";
import fr_translation from "./fr.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en_translation
  },
  es: {
    translation: es_translation
  },
  fr: {
    translation: fr_translation
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    fallbackLng: "en"
});

export default i18n;