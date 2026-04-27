import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import styles from '../styles/detectedSymptomsStyles';

export default function DetectedSymptomsScreen() {
  const router = useRouter();

  const speakSymptoms = () => {
    Speech.stop();
    Speech.speak(
      'Detected symptoms are headache, fever, body pain, and tiredness.'
    );
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
            <View style={styles.headerBar}>
              <Text style={styles.headerText}>Detected Symptoms</Text>
            </View>

            <View style={styles.symptomBox}>
              <Text style={styles.symptomText}>
                • headache{'\n'}
                • fever{'\n'}
                • body pain{'\n'}
                • tiredness
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.speakerButton,
                  pressed && styles.speakerPressed,
                ]}
                onPress={speakSymptoms}
              >
                <Image
                  source={require('../../assets/images/speaker.png')}
                  style={styles.speakerIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <Text style={styles.questionText}>Does this match you?</Text>

            <View style={styles.buttonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.choiceButton,
                  pressed && styles.choicePressed,
                ]}
                onPress={() => router.push('/tellusmore')}
              >
                <Text style={styles.choiceText}>YES</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.choiceButton,
                  pressed && styles.choicePressed,
                ]}
                onPress={() => router.replace('/textinput')}
              >
                <Text style={styles.choiceText}>NO</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backPressedGrey,
              ]}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/input')}
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>Home</Text>
            </Pressable>

            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/language')}
            >
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>Language</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}