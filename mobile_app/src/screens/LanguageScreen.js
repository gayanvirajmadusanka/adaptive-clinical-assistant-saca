import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import styles from '../styles/languageStyles';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const router = useRouter();

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

            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setSelectedLanguage('Warlpiri')}
            >
              <Text style={styles.languageText}>Warlpiri</Text>
              <View
                style={[
                  styles.radioCircle,
                  selectedLanguage === 'Warlpiri' && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setSelectedLanguage('English')}
            >
              <Text style={styles.languageText}>English</Text>
              <View
                style={[
                  styles.radioCircle,
                  selectedLanguage === 'English' && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.continuePressedGreen,
              ]}
              onPress={() => {
                if (selectedLanguage === 'English') {
                  router.push('/input');
                }
              }}
            >
              <Text style={styles.continueText}>
                Continue{'\n'}Yangka
              </Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}