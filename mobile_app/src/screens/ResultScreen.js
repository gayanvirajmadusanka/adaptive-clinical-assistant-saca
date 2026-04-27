import React from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
            <View style={[styles.resultCard, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.headerBar, { backgroundColor: theme.header }]}>
                <Text style={[styles.headerText, { color: theme.headerText }]}>
                  Final Results
                </Text>
              </View>

              <View style={styles.content}>
                <View style={[styles.severityBadge, { backgroundColor: theme.severityFill }]}>
                  <Text style={[styles.severityText, { color: theme.severityText }]}>
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

                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Recommendations</Text>
                  {recommendations[severityLevel].map((item) => (
                    <Text key={item} style={styles.infoText}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Symptoms</Text>
                  <Text style={styles.infoText}>• Headache</Text>
                  <Text style={styles.infoText}>• Fever</Text>
                  <Text style={styles.infoText}>• Body pain</Text>
                  <Text style={styles.infoText}>• Tiredness</Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.startAgainButton,
                    { borderColor: theme.startAgain },
                    pressed && styles.pressedButton,
                  ]}
                  onPress={() => router.replace('/')}
                >
                  <Text style={[styles.startAgainText, { color: theme.startAgain }]}>
                    Start again
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.footerItem} onPress={() => router.replace('/input')}>
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>Home</Text>
            </Pressable>

            <Pressable style={styles.footerItem} onPress={() => router.replace('/language')}>
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>Language</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}