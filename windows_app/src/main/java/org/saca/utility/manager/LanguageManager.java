package org.saca.utility.manager;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.ResourceBundle;

public class LanguageManager {

    private static Locale currentLocale = Locale.ENGLISH;

    public static void setLanguage(String languageCode) {
        currentLocale = new Locale(languageCode);
    }

    public static ResourceBundle getBundle() {
        return ResourceBundle.getBundle("lang.messages", currentLocale);
    }

    public static String get(String key) {
        return getBundle().getString(key);
    }

    public static String get(String key, Object... args) {
        return MessageFormat.format(getBundle().getString(key), args);
    }
}
