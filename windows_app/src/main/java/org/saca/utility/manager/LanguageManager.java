package org.saca.utility.manager;

import org.saca.utility.constant.AppsConstants;

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

    /**
     * @return True if the current app language is English
     */
    public static boolean isLanguageEnglish() {

        boolean isEnglish = getBundle()
                .getLocale().getLanguage()
                .equals(AppsConstants.AppLanguage.EN.getShortDescription());

        return isEnglish;
    }

    public static AppsConstants.AppLanguage getCurrentLangauge() {
        return isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN : AppsConstants.AppLanguage.WP;
    }
}
