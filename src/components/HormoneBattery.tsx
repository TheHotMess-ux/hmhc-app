import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';

type HormoneLevel =
  | 'High'
  | 'Rising'
  | 'Peak'
  | 'Stable'
  | 'Falling'
  | 'Lower'
  | 'Low';

type Props = {
  name: string;
  status: string;
  emoji: string;
  accentColor?: string;
};

function getBatteryLevel(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes('peak')) {
    return 5;
  }

  if (
    normalizedStatus.includes('high') ||
    normalizedStatus.includes('rising')
  ) {
    return 4;
  }

  if (
    normalizedStatus.includes('stable') ||
    normalizedStatus.includes('moderate')
  ) {
    return 3;
  }

  if (
    normalizedStatus.includes('falling') ||
    normalizedStatus.includes('lower')
  ) {
    return 2;
  }

  if (normalizedStatus.includes('low')) {
    return 1;
  }

  return 3;
}

function getStatusSymbol(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (
    normalizedStatus.includes('rising') ||
    normalizedStatus.includes('high') ||
    normalizedStatus.includes('peak')
  ) {
    return '↗';
  }

  if (normalizedStatus.includes('falling')) {
    return '↘';
  }

  return '→';
}

export default function HormoneBattery({
  name,
  status,
  emoji,
  accentColor = Colors.gold,
}: Props) {
  const batteryLevel = getBatteryLevel(status);
  const statusSymbol = getStatusSymbol(status);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.hormoneName}>
          {emoji} {name}
        </Text>

        <Text style={[styles.status, { color: accentColor }]}>
          {statusSymbol} {status}
        </Text>
      </View>

      <View style={styles.batteryRow}>
        <View
          style={[
            styles.batteryShell,
            { borderColor: accentColor },
          ]}
        >
          <View style={styles.batterySegments}>
            {[1, 2, 3, 4, 5].map((segment) => (
              <View
                key={segment}
                style={[
                  styles.batterySegment,
                  {
                    backgroundColor:
                      segment <= batteryLevel
                        ? accentColor
                        : Colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View
          style={[
            styles.batteryTip,
            { backgroundColor: accentColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  hormoneName: {
    color: '#F4F4F5',
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },

  status: {
    fontSize: 13,
    fontWeight: '800',
  },

  batteryRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  batteryShell: {
    borderRadius: 6,
    borderWidth: 1.5,
    flex: 1,
    padding: 3,
  },

  batterySegments: {
    flexDirection: 'row',
    gap: 3,
    height: 12,
  },

  batterySegment: {
    borderRadius: 2,
    flex: 1,
  },

  batteryTip: {
    borderBottomRightRadius: 3,
    borderTopRightRadius: 3,
    height: 10,
    marginLeft: 3,
    width: 4,
  },
});