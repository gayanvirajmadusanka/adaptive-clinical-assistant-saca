package org.saca.utility.util;

public class StringUtil {

    public static String capitalizeFirst(String text) {

        if (text == null || text.isEmpty()) {
            return text;
        }

        return Character.toUpperCase(text.charAt(0)) + text.substring(1);
    }
}
