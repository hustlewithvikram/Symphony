import {Dimensions, ScrollView, View} from 'react-native';
import {MainWrapper} from '../../layout/MainWrapper';
import {SmallBentooCard} from '../../components/home/SmallBentooCard';
import {Spacer} from '../../components/global/Spacer';
import {Heading} from '../../components/global/Heading';
import {BundleEachLanguage} from '../../components/discover/BundleEachLanguage';
import {BundleEachMomentanGenres} from '../../components/discover/BundleEachMomentanGenres';
import {RouteHeading} from '../../components/home/RouteHeading';
import {useAppTheme} from '../../theme';
import {PaddingConatiner} from '../../layout/PaddingConatiner';

// Data configuration for better maintainability
const DISCOVER_CONFIG = {
  cardPairs: [
    [
      {
        text: 'Trending Now',
        image: require('../../images/trending.png'),
        navigate: 'trending',
      },
      {
        text: 'Most Searched',
        image: require('../../images/MostSearched.png'),
        navigate: 'most searched',
      },
    ],
    [
      {
        text: 'Pop Hits',
        image: require('../../images/pop.png'),
        navigate: 'pop',
      },
      {
        text: 'Lofi Beats',
        image: require('../../images/lofi.png'),
        navigate: 'lofi',
      },
    ],
  ],
  languages: [
    ['English', 'Hindi'],
    ['Punjabi', 'Tamil'],
    ['Telugu', 'Marathi'],
    ['Gujarati', 'Bengali'],
    ['Kannada', 'Bhojpuri'],
    ['Malayalam', 'Urdu'],
    ['Odia', 'Assamese'],
  ],
  moments: [
    {list: ['Workout', 'Focus'], color: ['rgb(220,123,123)', 'rgb(137,87,65)']},
    {list: ['Chill', 'Party'], color: ['rgb(78,159,188)', 'rgb(233,125,241)']},
    {
      list: ['Long Drive', 'Sleep'],
      color: ['rgb(208,186,99)', 'rgb(88,140,208)'],
    },
    {
      list: ['Late Night', 'Study'],
      color: ['rgb(143,172,99)', 'rgb(145,94,186)'],
    },
  ],
  genres: [
    {
      list: ['Hip Hop', 'Jazz'],
      color: ['rgb(227,148,124)', 'rgb(110,236,192)'],
    },
    {
      list: ['Retro', 'Classical'],
      color: ['rgb(123,234,132)', 'rgb(246,208,82)'],
    },
    {list: ['K-Pop', 'Lofi'], color: ['rgb(178,109,234)', 'rgb(109,145,223)']},
    {list: ['Romance', 'Sad'], color: ['rgb(236,144,199)', 'rgb(199,229,148)']},
  ],
};

export const Discover = () => {
  const width = Dimensions.get('window').width;
  const theme = useAppTheme();
  const cardWidth = width * 0.46;

  const renderCardPair = (pair, index) => (
    <View key={`card-pair-${index}`} style={styles.cardRow}>
      {pair.map(card => (
        <SmallBentooCard
          key={card.text}
          text={card.text}
          image={card.image}
          width={cardWidth}
          navigate={card.navigate}
        />
      ))}
    </View>
  );

  const renderHorizontalSection = (data, renderItem) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalScrollContent}>
      {data.map((item, index) => renderItem(item, index))}
    </ScrollView>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      {/* Header */}
      <RouteHeading bottomText="Discover music" showSearch={true} />

      {/* Quick Access Cards */}
      {DISCOVER_CONFIG.cardPairs.map(renderCardPair)}

      <Spacer />

      {/* Content Sections */}
      <PaddingConatiner>
        {/* Languages */}
        <View style={styles.section}>
          <Heading text="Languages" />
          {renderHorizontalSection(
            DISCOVER_CONFIG.languages,
            (languages, index) => (
              <BundleEachLanguage key={`lang-${index}`} languages={languages} />
            ),
          )}
        </View>

        {/* Moments */}
        <View style={styles.section}>
          <Heading text="Moments" />
          {renderHorizontalSection(DISCOVER_CONFIG.moments, (moment, index) => (
            <BundleEachMomentanGenres
              key={`moment-${index}`}
              list={moment.list}
              color={moment.color}
            />
          ))}
        </View>

        {/* Genres */}
        <View style={styles.section}>
          <Heading text="Genres" />
          {renderHorizontalSection(DISCOVER_CONFIG.genres, (genre, index) => (
            <BundleEachMomentanGenres
              key={`genre-${index}`}
              list={genre.list}
              color={genre.color}
            />
          ))}
        </View>
      </PaddingConatiner>
    </ScrollView>
  );
};

const styles = {
  container: {
    paddingBottom: 20,
    paddingTop: 40,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  horizontalScrollContent: {
    gap: 10,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
};
