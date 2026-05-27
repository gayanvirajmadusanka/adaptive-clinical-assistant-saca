// LanguageModal.js
// Purpose:
// Reusable language selection modal used across SACA screens.
//
// Features:
// - Select English or Warlpiri
// - Animated popup effect
// - Confirm and Cancel actions
// - Shared styles using commonLayoutStyles
//
// Why reusable:
// Prevents duplicating modal UI and logic on every screen.

// Import React
import React from 'react';

// Import reusable React Native components
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

// Import language translation helper
import { useLanguage } from '../context/LanguageContext';

// Import shared modal/common styles
import commonStyles from '../styles/commonLayoutStyles';


// ----------------------------------------------------
// LanguageModal Component
// ----------------------------------------------------
// Props:
//
// visible            → controls modal visibility
// selectedLang       → currently selected language
// scaleAnim          → animated scale value
// disabled           → disables confirm button
// confirmLabel       → optional custom confirm text
// cancelLabel        → optional custom cancel text
// onSelectLanguage   → callback when language selected
// onConfirm          → callback when confirm pressed
// onCancel           → callback when modal closes
// ----------------------------------------------------
export default function LanguageModal({
  visible,
  selectedLang,
  scaleAnim,
  disabled = false,
  confirmLabel,
  cancelLabel,
  onSelectLanguage,
  onConfirm,
  onCancel,
}) {

  // Access translation helper
  const { t } = useLanguage();


  // ----------------------------------------------------
  // Modal UI
  // ----------------------------------------------------
  return (

    // Native modal component
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >

      {/* Dark transparent background overlay */}
      <View style={commonStyles.modalOverlay}>

        {/* Animated modal container */}
        <Animated.View
          style={[
            commonStyles.languageModal,

            // Scale animation effect
            { transform: [{ scale: scaleAnim }] },
          ]}
        >

          {/* Modal title */}
          <Text style={commonStyles.modalTitle}>
            {t('select_language')}
          </Text>


          {/* ------------------------------------------------
              ENGLISH OPTION
             ------------------------------------------------ */}
          <Pressable
            style={[
              commonStyles.languageOption,

              // Highlight if selected
              selectedLang === 'en' &&
                commonStyles.languageOptionSelected,
            ]}

            onPress={() => onSelectLanguage('en')}
          >

            {/* English label */}
            <Text
              style={[
                commonStyles.languageOptionText,

                // Selected text color/style
                selectedLang === 'en' &&
                  commonStyles.languageOptionTextSelected,
              ]}
            >
              {t('english')}
            </Text>
          </Pressable>


          {/* ------------------------------------------------
              WARLPIRI OPTION
             ------------------------------------------------ */}
          <Pressable
            style={[
              commonStyles.languageOption,

              // Highlight if selected
              selectedLang === 'wp' &&
                commonStyles.languageOptionSelected,
            ]}

            onPress={() => onSelectLanguage('wp')}
          >

            {/* Warlpiri label */}
            <Text
              style={[
                commonStyles.languageOptionText,

                // Selected text color/style
                selectedLang === 'wp' &&
                  commonStyles.languageOptionTextSelected,
              ]}
            >
              {t('warlpiri')}
            </Text>
          </Pressable>


          {/* Confirmation helper text */}
          <Text style={commonStyles.confirmText}>
            {t('change_language')}
          </Text>


          {/* ------------------------------------------------
              BUTTON ROW
             ------------------------------------------------ */}
          <View style={commonStyles.modalButtonRow}>


            {/* --------------------------------------------
                CONFIRM BUTTON
               -------------------------------------------- */}
            <Pressable
              style={({ pressed }) => [
                commonStyles.confirmButton,

                // Press animation
                pressed && commonStyles.modalButtonPressed,

                // Disabled state
                (!selectedLang || disabled) &&
                  commonStyles.disabledButton,
              ]}

              disabled={!selectedLang || disabled}

              onPress={onConfirm}
            >

              {({ pressed }) => (

                // Confirm button text
                <Text
                  style={[
                    commonStyles.confirmButtonText,

                    // White text when pressed
                    pressed && { color: '#FFF' },
                  ]}
                >
                  {confirmLabel || t('ok')}
                </Text>
              )}
            </Pressable>


            {/* --------------------------------------------
                CANCEL BUTTON
               -------------------------------------------- */}
            <Pressable
              style={({ pressed }) => [
                commonStyles.cancelButton,

                // Press animation
                pressed && commonStyles.modalButtonPressed,
              ]}

              onPress={onCancel}
            >

              {({ pressed }) => (

                // Cancel button text
                <Text
                  style={[
                    commonStyles.cancelText,

                    // White text when pressed
                    pressed && { color: '#FFF' },
                  ]}
                >
                  {cancelLabel || t('cancel')}
                </Text>
              )}
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}