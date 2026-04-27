import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import styles from '../styles/languageStyles';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const router = useRouter();

  const handlePress = (language) => {
    setSelectedLanguage(language);

    setTimeout(() => {
      if (language === 'English') {
        router.push('/input');
      }
    }, 200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <View style={styles.wrapper}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <Text style={styles.title}>
              Select Language{'\n'}Wangka
            </Text>

            {/* WARLPIRI */}
            <Pressable
              style={[
                styles.button,
                styles.defaultButton,
                selectedLanguage === 'Warlpiri' && styles.selectedButton,
              ]}
              onPress={() => handlePress('Warlpiri')}
            >
              <Text
                style={[
                  styles.text,
                  styles.defaultText,
                  selectedLanguage === 'Warlpiri' && styles.selectedText,
                ]}
              >
                Warlpiri
              </Text>
            </Pressable>

            {/* ENGLISH */}
            <Pressable
              style={[
                styles.button,
                styles.defaultButton,
                selectedLanguage === 'English' && styles.selectedButton,
              ]}
              onPress={() => handlePress('English')}
            >
              <Text
                style={[
                  styles.text,
                  styles.defaultText,
                  selectedLanguage === 'English' && styles.selectedText,
                ]}
              >
                English
              </Text>
            </Pressable>

          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}