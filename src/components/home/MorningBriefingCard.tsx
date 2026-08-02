import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getFeralForecast } from "@/lib/forecast";

import ForecastChip from "./ForecastChip";

type CyclePhase =
  | "Menstrual"
  | "Follicular"
  | "Ovulation"
  | "Luteal";

type MorningBriefingCardProps = {
  name?: string;
  phase?: CyclePhase;
  cycleDay?: number;
};

type PhaseBriefing = {
  eyebrow: string;
  headline: string;
  explanation: string;
  focus: string;
  focusDescription: string;
  whisper: string;
  accent: string;
  softAccent: string;
};

const phaseBriefings: Record<CyclePhase, PhaseBriefing> = {
  Menstrual: {
    eyebrow: "A quieter chapter",
    headline: "Today may be asking for a gentler pace.",
    explanation:
      "Your hormones are at their lowest point right now. If your energy feels softer or your body wants more rest, that is information, not failure.",
    focus: "Protect your energy",
    focusDescription:
      "Choose what truly matters today and let the rest wait.",
    whisper: "You do not have to earn a slower day.",
    accent: "#9A4F61",
    softAccent: "#F7E9ED",
  },

  Follicular: {
    eyebrow: "Energy is returning",
    headline: "You may feel a little more capable today.",
    explanation:
      "Estrogen is beginning to rise. Motivation, curiosity and mental clarity may gradually start waking up with you.",
    focus: "Follow the spark",
    focusDescription:
      "Use your returning energy for one thing that feels meaningful.",
    whisper: "You are allowed to begin again without explaining the pause.",
    accent: "#B78328",
    softAccent: "#FBF3E2",
  },

  Ovulation: {
    eyebrow: "Your brighter window",
    headline: "Your body may be ready to take up more space.",
    explanation:
      "Estrogen is near its peak and testosterone may offer a little extra confidence, energy and social momentum.",
    focus: "Use your voice",
    focusDescription:
      "This may be a good day for connection, creativity or a brave conversation.",
    whisper: "You do not need to shrink to make other people comfortable.",
    accent: "#B86B7C",
    softAccent: "#F9EDEF",
  },

  Luteal: {
    eyebrow: "A more inward season",
    headline: "Today may call for fewer demands and clearer boundaries.",
    explanation:
      "Estrogen and progesterone may be shifting or beginning to decline. If your patience, energy or concentration feels different, your body is communicating.",
    focus: "Reduce the noise",
    focusDescription:
      "Simplify one decision, one task or one expectation today.",
    whisper: "Your body deserves curiosity before criticism.",
    accent: "#7C689E",
    softAccent: "#F0ECF6",
  },
};

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default function MorningBriefingCard({
  name = "Sheena",
  phase = "Luteal",
  cycleDay,
}: MorningBriefingCardProps) {
  const briefing = phaseBriefings[phase];

  const forecast = getFeralForecast(cycleDay ?? 25);

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnimation, slideAnimation]);

  const greeting = useMemo(() => getGreeting(), []);

  const cycleLabel =
    typeof cycleDay === "number"
      ? `${phase} phase • Cycle day ${cycleDay}`
      : `${phase} phase`;

  <View style={styles.forecastRow}>
  <ForecastChip
    emoji="☕"
    title="Coffee"
    value={forecast.coffeeForecast}
  />

  <ForecastChip
    emoji="🧠"
    title="Brain Fog"
    value={forecast.brainFogForecast}
  />

  <ForecastChip
    emoji="😤"
    title="Patience"
    value={forecast.patienceForecast}
  />
</View>    

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: briefing.softAccent,
          borderColor: `${briefing.accent}33`,
          opacity: fadeAnimation,
          transform: [{ translateY: slideAnimation }],
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.greetingGroup}>
          <Text style={styles.greeting}>
            {greeting}, {name}
          </Text>

          <Text
            style={[
              styles.phaseLabel,
              {
                color: briefing.accent,
              },
            ]}
          >
            {cycleLabel}
          </Text>
        </View>

        <View
          style={[
            styles.sunIcon,
            {
              backgroundColor: `${briefing.accent}18`,
            },
          ]}
        >
          <Text style={styles.sunEmoji}>☀️</Text>
        </View>
      </View>

      <View style={styles.introSection}>
        <Text
          style={[
            styles.eyebrow,
            {
              color: briefing.accent,
            },
          ]}
        >
          {briefing.eyebrow}
        </Text>

        <Text style={styles.headline}>{briefing.headline}</Text>

        <Text style={styles.explanation}>{briefing.explanation}</Text>
      </View>

<View
  style={[
    styles.focusCard,
    {
      borderLeftColor: briefing.accent,
    },
  ]}
>
  <Text style={styles.focusLabel}>TODAY’S MISSION</Text>

  <Text style={styles.focusTitle}>
    {forecast.mission}
  </Text>

  <Text style={styles.focusDescription}>
    {briefing.focusDescription}
  </Text>
</View>

<View style={styles.whisperSection}>
  <Text style={styles.whisperLabel}>TODAY’S WHISPER</Text>

  <Text style={styles.whisperText}>
    “{forecast.whisper}”
  </Text>
</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    gap: 22,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,

    elevation: 4,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },

  greetingGroup: {
    flex: 1,
    gap: 7,
  },

  greeting: {
    color: "#19161A",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.6,
  },

  phaseLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  sunIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  sunEmoji: {
    fontSize: 23,
  },

  introSection: {
    gap: 10,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },

  headline: {
    color: "#201B21",
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "700",
    letterSpacing: -0.4,
  },

  explanation: {
    color: "#5E565F",
    fontSize: 15,
    lineHeight: 23,
  },

  focusCard: {
    backgroundColor: "rgba(255, 255, 255, 0.62)",
    borderRadius: 18,
    borderLeftWidth: 4,
    paddingHorizontal: 17,
    paddingVertical: 16,
    gap: 5,
  },

  focusLabel: {
    color: "#766E76",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  focusTitle: {
    color: "#201B21",
    fontSize: 17,
    fontWeight: "700",
  },

  focusDescription: {
    color: "#655D65",
    fontSize: 14,
    lineHeight: 20,
  },

  whisperSection: {
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 10,
    paddingTop: 2,
  },

  whisperLabel: {
    color: "#877E87",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  whisperText: {
    color: "#373037",
    fontSize: 16,
    lineHeight: 23,
    fontStyle: "italic",
    fontWeight: "500",
    textAlign: "center",
  },

  forecastRow: {
  flexDirection: "row",
  gap: 12,
},
});