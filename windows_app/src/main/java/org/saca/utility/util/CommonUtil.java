package org.saca.utility.util;

import java.util.List;

/**
 * Common Utilities
 *
 * <p>This class keeps utility methods to reuse</p>
 *
 * @author Gayan Madusanka
 */
public class CommonUtil {

    public static boolean isListEmpty(List<?> list) {
        return list == null || list.isEmpty();
    }
}
