import { View, Text, Image, StyleSheet } from 'react-native';
import skills from '../../skills.json';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/professional-software-developer-stockcake.webp')}
        style={styles.image}
      />

      <Text style={styles.name}>Christopher Thistlewood</Text>

      <Text style={styles.bio}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in urna a
        mi mattis fermentum at non nisi. Class aptent taciti sociosqu ad litora
        torquent per conubia nostra, per inceptos himenaeos. Maecenas molestie,
        augue eget dapibus tempor, massa elit auctor orci, vel placerat leo orci
        quis diam. Maecenas non hendrerit lectus. Donec ut vestibulum sem,
        ultricies pretium tortor. Vestibulum sed et.
      </Text>

      <View style={styles.divider} />

      <View style={styles.skillsWrapper}>
        {skills.map((item, index) => (
          <View
            key={`${item.skill}-${index}`}
            style={[styles.skillBadge, { backgroundColor: item.color }]}
          >
            <Text style={styles.skillText}>
              {item.skill} {getEmoji(item.skill)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function getEmoji(skill: string) {
  switch (skill) {
    case 'HTML+CSS':
      return '💪';
    case 'JavaScript':
      return '🐥';
    case 'Web Design':
      return '💪';
    case 'Git and GitHub':
      return '🙌';
    case 'React':
      return '💪';
    case 'Angular':
      return '🥵';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 100,
    paddingHorizontal: 30,
  },
  image: {
    width: '100%',
    height: '27%',
    resizeMode: 'cover',
    marginTop: 30,
    marginBottom: 18,
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
  },
  bio: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    marginBottom: 26,
  },
  divider: {
    height: 1,
    backgroundColor: '#bdbdbd',
    marginBottom: 24,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  skillBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
});