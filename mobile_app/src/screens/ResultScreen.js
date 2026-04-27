import React from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles, { resultTheme } from '../styles/resultStyles';

export default function ResultScreen() {
  const router = useRouter();

  const severityLevel = 'moderate';
  const theme = resultTheme[severityLevel];

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

              {/* 🔥 CENTERED HEADER */}
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

                {/* 🔥 BIGGER BOX */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Recommendations</Text>
                  <Text style={[styles.fakeLine, { backgroundColor: theme.line }]} />
                  <Text style={[styles.fakeLineSmall, { backgroundColor: theme.line }]} />
                  <Text style={[styles.fakeLineTiny, { backgroundColor: theme.line }]} />
                </View>

                {/* 🔥 BIGGER BOX */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Symptoms</Text>
                  <Text style={[styles.fakeLine, { backgroundColor: theme.line }]} />
                  <Text style={[styles.fakeLineSmall, { backgroundColor: theme.line }]} />
                  <Text style={[styles.fakeLineTiny, { backgroundColor: theme.line }]} />
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

          {/* FOOTER */}
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