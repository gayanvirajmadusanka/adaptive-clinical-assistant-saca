// LanguageModal.js
// Purpose: Reusable language selection modal for English and Warlpiri.
// Screens can use this instead of duplicating modal JSX and modal styles.

import React from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import commonStyles from '../styles/commonLayoutStyles';

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
  const { t } = useLanguage();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={commonStyles.modalOverlay}>
        <Animated.View
          style={[
            commonStyles.languageModal,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={commonStyles.modalTitle}>{t('select_language')}</Text>

          <Pressable
            style={[
              commonStyles.languageOption,
              selectedLang === 'en' && commonStyles.languageOptionSelected,
            ]}
            onPress={() => onSelectLanguage('en')}
          >
            <Text
              style={[
                commonStyles.languageOptionText,
                selectedLang === 'en' && commonStyles.languageOptionTextSelected,
              ]}
            >
              {t('english')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              commonStyles.languageOption,
              selectedLang === 'wp' && commonStyles.languageOptionSelected,
            ]}
            onPress={() => onSelectLanguage('wp')}
          >
            <Text
              style={[
                commonStyles.languageOptionText,
                selectedLang === 'wp' && commonStyles.languageOptionTextSelected,
              ]}
            >
              {t('warlpiri')}
            </Text>
          </Pressable>

          <Text style={commonStyles.confirmText}>{t('change_language')}</Text>

          <View style={commonStyles.modalButtonRow}>
            <Pressable
              style={({ pressed }) => [
                commonStyles.confirmButton,
                pressed && commonStyles.modalButtonPressed,
                (!selectedLang || disabled) && commonStyles.disabledButton,
              ]}
              disabled={!selectedLang || disabled}
              onPress={onConfirm}
            >
              <Text style={commonStyles.confirmButtonText}>
                {confirmLabel || t('ok')}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                commonStyles.cancelButton,
                pressed && commonStyles.modalButtonPressed,
              ]}
              onPress={onCancel}
            >
              <Text style={commonStyles.cancelText}>
                {cancelLabel || t('cancel')}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
