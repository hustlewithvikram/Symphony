import {MainWrapper} from '../../layout/MainWrapper';
import {SmallBentooCard} from '../../components/home/SmallBentooCard';
import {Dimensions, ScrollView, View} from 'react-native';
import {Spacer} from '../../components/global/Spacer';
import {Heading} from '../../components/global/Heading';
import {PaddingConatiner} from '../../layout/PaddingConatiner';
import {BundleEachLanguage} from '../../components/discover/BundleEachLanguage';
import {BundleEachMomentanGenres} from '../../components/discover/BundleEachMomentanGenres';
import {RouteHeading} from '../../components/home/RouteHeading';

export const Discover = () => {
  const width = Dimensions.get('window').width;
  return (
    <MainWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        {/* Discover music */}
        <RouteHeading bottomText={'Discover music'} showSearch={true} />

        {/*  */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-around',
            paddingHorizontal: 10,
          }}>
          <SmallBentooCard
            text={'Trending Now'}
            image={require('../../images/trending.png')}
            width={width * 0.46}
            navigate={'trending'}
          />
          <SmallBentooCard
            text={'Most Searched'}
            image={require('../../images/MostSearched.png')}
            width={width * 0.46}
            navigate={'most searched'}
          />
        </View>
        <Spacer />
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-around',
            paddingHorizontal: 10,
          }}>
          <SmallBentooCard
            text={'Pop Hits'}
            image={require('../../images/pop.png')}
            width={width * 0.46}
            navigate={'pop'}
          />
          <SmallBentooCard
            text={'Lofi Beats'}
            image={require('../../images/lofi.png')}
            width={width * 0.46}
            navigate={'lofi'}
          />
        </View>
        <PaddingConatiner>
          <Heading text={'Languages'} />
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{gap: 10}}>
            <BundleEachLanguage languages={['English', 'Hindi']} />
            <BundleEachLanguage languages={['Punjabi', 'Tamil']} />
            <BundleEachLanguage languages={['Telugu', 'Marathi']} />
            <BundleEachLanguage languages={['Gujarati', 'Bengali']} />
            <BundleEachLanguage languages={['Kannada', 'Bhojpuri']} />
            <BundleEachLanguage languages={['Malayalam', 'Urdu']} />
            <BundleEachLanguage languages={['Odia', 'Assamese']} />
          </ScrollView>
          <Heading text={'Moments'} />
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{gap: 10}}>
            <BundleEachMomentanGenres
              list={['Workout', 'Focus']}
              color={['rgb(220,123,123)', 'rgb(137,87,65)']}
            />
            <BundleEachMomentanGenres
              list={['Chill', 'Party']}
              color={['rgb(78,159,188)', 'rgb(233,125,241)']}
            />
            <BundleEachMomentanGenres
              list={['Long Drive', 'Sleep']}
              color={['rgb(208,186,99)', 'rgb(88,140,208)']}
            />
            <BundleEachMomentanGenres
              list={['Late Night', 'Study']}
              color={['rgb(143,172,99)', 'rgb(145,94,186)']}
            />
          </ScrollView>
          <Heading text={'Genres'} />
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{gap: 10}}>
            <BundleEachMomentanGenres
              list={['Hip Hop', 'Jazz']}
              color={['rgb(227,148,124)', 'rgb(110,236,192)']}
            />
            <BundleEachMomentanGenres
              list={['Retro', 'Classical']}
              color={['rgb(123,234,132)', 'rgb(246,208,82)']}
            />
            <BundleEachMomentanGenres
              list={['K-Pop', 'Lofi']}
              color={['rgb(178,109,234)', 'rgb(109,145,223)']}
            />
            <BundleEachMomentanGenres
              list={['Romance', 'Sad']}
              color={['rgb(236,144,199)', 'rgb(199,229,148)']}
            />
          </ScrollView>
        </PaddingConatiner>
      </ScrollView>
    </MainWrapper>
  );
};
