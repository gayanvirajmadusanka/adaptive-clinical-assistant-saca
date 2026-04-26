import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/textInputStyles';

export default function TextInputScreen() {
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
            <View style={styles.headerBar}>
              <Text style={styles.headerText}>Text</Text>
              <Image
                source={require('../../assets/images/text.png')}
                style={styles.headerIcon}
                resizeMode="contain"
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.questionText}>What can I help with?</Text>

              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Describe your Symptoms and press Continue"
                placeholderTextColor="#555"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.continuePressedGreen,
              ]}
            >
              <Text style={styles.continueText}>Continue</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>

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