import {
    Alert,
    Linking,
    Platform,
} from 'react-native';

export async function openBetaFeedbackEmail() {
  const subject = encodeURIComponent(
    'HMHC Beta Feedback',
  );

  const body = encodeURIComponent(
    `Hi HMHC,

What I was doing:


What worked well:


What felt confusing or broken:


Something I wish HMHC included:


Device: ${Platform.OS} ${Platform.Version}
`,
  );

  const emailUrl =
    'mailto:sheena@thehotmesshormoneclub.com' +
    `?subject=${subject}&body=${body}`;

  try {
    await Linking.openURL(emailUrl);
  } catch (error) {
    console.error(
      'Unable to open beta feedback email:',
      error,
    );

    Alert.alert(
      'Unable to open email',
      'Please send your feedback directly to sheena@thehotmesshormoneclub.com.',
    );
  }
}