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
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/languageStyles';

export default function LanguageScreen() {
  const router = useRouter();
  const { setLang } = useLanguage();

  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handlePress = (language) => {
    setSelectedLanguage(language);

    if (language === 'English') {
      setLang('en');
    } else if (language === 'Warlpiri') {
      setLang('wp');
    }

    setTimeout(() => {
      router.replace('/input');
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