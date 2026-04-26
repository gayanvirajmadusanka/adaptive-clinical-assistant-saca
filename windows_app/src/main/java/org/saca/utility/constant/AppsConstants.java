package org.saca.utility.constant;

public class AppsConstants {

    public enum AppLanguage {
        EN("en", "English"), WP("wp", "Warlpiri");

        private final String shortDescription;

        private final String longDescription;

        AppLanguage(String shortDescription, String longDescription) {
            this.shortDescription = shortDescription;
            this.longDescription = longDescription;
        }

        public static AppLanguage resolveAppLanguage(String str) {
            AppLanguage matchingStr = null;
            if (str != null && !str.isEmpty()) {
                matchingStr = AppLanguage.valueOf(str.trim());
            }
            return matchingStr;
        }

        public String getShortDescription() {
            return shortDescription;
        }

        public String getLongDescription() {
            return longDescription;
        }
    }

    public enum YesNo {
        Y("Yes"), N("No");

        private final String description;

        YesNo(String description) {
            this.description = description;
        }

        public static YesNo resolveYesNo(String str) {
            YesNo matchingStr = null;
            if (str != null && !str.isEmpty()) {
                matchingStr = YesNo.valueOf(str.trim());
            }
            return matchingStr;
        }

        public String getDescription() {
            return description;
        }
    }
}
