import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, View, StatusBar} from 'react-native';
import {LoadingComponent} from '../global/Loading';
import {EachPlaylistCard} from '../global/EachPlaylistCard';
import {getSearchPlaylistData} from '../../api/playlist';
import {Heading} from '../global/Heading';
import {PaddingConatiner} from '../../layout/PaddingConatiner';
import {Spacer} from '../global/Spacer';
import {Text} from 'react-native-paper';
import {useAppTheme} from '../../theme';

export default function ShowPlaylistofType({route}) {
  const theme = useAppTheme();
  const {Searchtext} = route.params;
  const limit = 30;
  const [Data, setData] = useState({});
  const [Loading, setLoading] = useState(false);

  async function addSearchData() {
    if (Searchtext !== '') {
      try {
        setLoading(true);
        const fetchdata = await getSearchPlaylistData(Searchtext, 1, limit);
        setData(fetchdata);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    addSearchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = Dimensions.get('window').width;
  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: statusBarHeight,
        backgroundColor: theme.colors.primaryDark,
      }}>
      <PaddingConatiner>
        <Heading text={Searchtext.toUpperCase()} />
      </PaddingConatiner>

      {Loading && <LoadingComponent loading={true} />}

      {!Loading && (
        <>
          {Data?.data?.results?.length !== 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={2}
              keyExtractor={(item, index) => String(index)}
              contentContainerStyle={{
                paddingBottom: 100,
                paddingHorizontal: 10,
              }}
              data={Data?.data?.results}
              renderItem={item => {
                return (
                  <EachPlaylistCard
                    name={item.item.name}
                    follower={'Total ' + item.item.songCount + ' Songs'}
                    key={item.index}
                    image={item.item.image[2].link}
                    id={item.item.id}
                    MainContainerStyle={{
                      width: width * 0.45,
                      marginHorizontal: 5,
                      marginBottom: 10,
                    }}
                    ImageStyle={{
                      height: 140,
                    }}
                  />
                );
              }}
            />
          )}

          {Data?.data?.results?.length === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <Text
                variant="headlineSmall"
                style={{textAlign: 'center', marginBottom: 8}}>
                No Playlist found!
              </Text>
              <Text
                variant="bodyMedium"
                style={{textAlign: 'center', opacity: 0.7}}>
                Opps! T_T
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}
