import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/aboutStyles';

export default function AboutScreen() {
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
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
              Welcome ( Nyampu nyinami){'\n'}to SACA...
            </Text>

            <Image
              source={require('../../assets/images/SACA_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.subTitle}>
              Smart Adaptive Clinical Assistant (SACA)
            </Text>

            <Text style={styles.paragraph}>
              SACA is a smart Mobile app that helps you understand symptoms using AI.
              Describe issues via text, voice, or body map and get quick insights.
              It supports early health awareness and is not a replacement for medical advice.
            </Text>

            <Text style={styles.paragraph}>
              SACA ka smart mobile app nyuntu-kurra.
              Ngula nyuntu symptoms yimi (text), wangka (voice), manu body map-kurlu
              nyampu yimi. AI ka nyampu nyanyi manu nyuntu quick kulini symptoms.
              Ngula health early kuju-kuju manu nyuntu ngurrju kulini. Ngula doctor
              manu medical advice replacement nyampuju lawa.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backPressedGreen,
              ]}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>← Back{'\n'}Yankirri</Text>
            </Pressable>
          </ScrollView>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}