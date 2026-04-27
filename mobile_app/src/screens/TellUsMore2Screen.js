import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../styles/tellUsMoreStyles';

export default function TellUsMore2Screen() {
  const router = useRouter();
  const { painLevel } = useLocalSearchParams();
  const [duration, setDuration] = useState(null);

  const options = [
    { label: 'Today', style: 'noneButton', textStyle: 'noneText' },
    { label: 'Yesterday', style: 'littleButton', textStyle: 'littleText' },
    { label: '2–3 days', style: 'moderateButton', textStyle: 'lightText' },
    { label: 'About a week', style: 'veryBadButton', textStyle: 'lightText' },
    { label: 'More than a week', style: 'unbearableButton', textStyle: 'lightText' },
  ];

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
              <Text style={styles.headerText}>Tell Us More</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>HOW LONG</Text>
              <Text style={styles.question}>How long have you felt this way?</Text>

              {options.map((item) => (
                <Pressable
                  key={item.label}
                  style={({ pressed }) => [
                    styles.answerButton,
                    styles[item.style],
                    duration === item.label && styles.selectedAnswer,
                    pressed && styles.pressedAnswer,
                  ]}
                  onPress={() => setDuration(item.label)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      duration === item.label && styles.radioOuterSelected,
                    ]}
                  >
                    {duration === item.label && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <Text style={[styles.answerText, styles[item.textStyle]]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.continuePressed,
              ]}
              onPress={() => {
                if (duration) {
                  router.push({
                    pathname: '/loadingseverity',
                    params: { painLevel, duration },
                  });
                }
              }}
            >
              <Text style={styles.continueText}>Continue</Text>
            </Pressable>
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