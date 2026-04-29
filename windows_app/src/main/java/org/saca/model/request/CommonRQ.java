package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.LanguageManager;

public class CommonRQ {

    @JsonProperty("language")
    private String language;

    public String getLanguage() {
        return LanguageManager.getBundle()
                .getLocale().getLanguage()
                .equals(AppsConstants.AppLanguage.EN.getShortDescription())
                ? AppsConstants.AppLanguage.EN.getShortDescription() : AppsConstants.AppLanguage.WP.getShortDescription();
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
