import React from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import styles, { resultTheme } from '../styles/resultStyles';

export default function ResultScreen() {
  const router = useRouter();
  const { painLevel, duration } = useLocalSearchParams();

  const getSeverityLevel = () => {
    if (painLevel === 'Unbearable' || painLevel === 'Very bad') {
      return 'severe';
    }

    if (
      painLevel === 'Moderate' ||
      duration === 'About a week' ||
      duration === 'More than a week'
    ) {
      return 'moderate';
    }

    return 'mild';
  };

  const severityLevel = getSeverityLevel();
  const theme = resultTheme[severityLevel];

  const recommendations = {
    mild: [
      'Rest and drink enough water.',
      'Monitor your symptoms.',
      'Use basic home care if needed.',
    ],
    moderate: [
      'Monitor your symptoms closely.',
      'Drink water and take rest.',
      'Visit a clinic if symptoms get worse.',
    ],
    severe: [
      'Seek medical help immediately.',
      'Call for help if symptoms are serious.',
      'Do not wait if pain becomes unbearable.',
    ],
  };

  const symptoms = ['Headache', 'Fever', 'Body pain', 'Tiredness'];

  const speakContent = () => {
    const text = `
      Your severity level is ${severityLevel}.
      Recommendations are ${recommendations[severityLevel].join(', ')}.
      Symptoms include ${symptoms.join(', ')}.
    `;

    Speech.speak(text);
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
          <View style={styles.contentWrapper}>
            <View
              style={[
                styles.resultCard,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <View
                style={[
                  styles.headerBar,
                  { backgroundColor: theme.header },
                ]}
              >
                <Text style={[styles.headerText, { color: theme.headerText }]}>
                  Final Results
                </Text>
              </View>

              <View style={styles.content}>
                <Pressable
                  style={({ pressed }) => [
                    styles.speakerButton,
                    pressed && styles.pressedButton,
                  ]}
                  onPress={speakContent}
                >
                  <Image
                    source={require('../../assets/images/speaker.png')}
                    style={styles.speakerIcon}
                    resizeMode="contain"
                  />
                </Pressable>

                <View
                  style={[
                    styles.severityBadge,
                    { backgroundColor: theme.severityFill },
                  ]}
                >
                  <Text
                    style={[
                      styles.severityText,
                      { color: theme.severityText },
                    ]}
                  >
                    {theme.severityLabel}
                  </Text>
                </View>

                {severityLevel === 'severe' && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.callButton,
                      pressed && styles.pressedButton,
                    ]}
                  >
                    <Text style={styles.callButtonText}>📞 Call for Help</Text>
                  </Pressable>
                )}

                <View
                  style={[
                    styles.infoBox,
                    {
                      backgroundColor: theme.boxBackground,
                      borderColor: theme.boxBorder,
                    },
                  ]}
                >
                  <Text style={[styles.infoTitle, { color: theme.boxText }]}>
                    Recommendations
                  </Text>

                  {recommendations[severityLevel].map((item) => (
                    <Text
                      key={item}
                      style={[styles.infoText, { color: theme.boxText }]}
                    >
                      • {item}
                    </Text>
                  ))}
                </View>

                <View
                  style={[
                    styles.infoBox,
                    {
                      backgroundColor: theme.boxBackground,
                      borderColor: theme.boxBorder,
                    },
                  ]}
                >
                  <Text style={[styles.infoTitle, { color: theme.boxText }]}>
                    Symptoms
                  </Text>

                  {symptoms.map((item) => (
                    <Text
                      key={item}
                      style={[styles.infoText, { color: theme.boxText }]}
                    >
                      • {item}
                    </Text>
                  ))}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.startAgainButton,
                    { borderColor: theme.startAgain },
                    pressed && styles.pressedButton,
                  ]}
                  onPress={() => router.replace('/')}
                >
                  <Text
                    style={[
                      styles.startAgainText,
                      { color: theme.startAgain },
                    ]}
                  >
                    Start again
                  </Text>
                </Pressable>
              </View>
            </View>
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