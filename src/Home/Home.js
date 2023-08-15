import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const labels = ['월', '화', '수', '목', '금', '토', '일'];


const Home = ({ onNavigateToMore, navigateToPhotoAnalysis, navigateToVideoAnalysis }) => {
  const getData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const popName = await AsyncStorage.getItem('userId')
      return [accessToken, popName];
    } catch (error) {
      console.error('Error getting data:', error);
      return 0;
    }
  };
  const protein = { "닭가슴살": "닭가슴살은 칼로리가 낮지만 고단백질입니다.", "삶은 계란": "삶은 계란은 단백질 함량이 많기 때문에...(설명)" };
  const vitamin = { "치즈": "치즈에 들어있는 비타민A와 펩타이드는 항산화 작용으로 암세포 증식을 억제합니다.", "시금치": "시금치설명", "소의 간": "소의 간 설명" };
  const carbon = { "감자": "감자는 탄수화물이 많고 칼로리가 적으며 저렴하게 구할 수 있습니다.", "고구마": "고구마설명", "콩": "콩설명" };
  const province = { "아몬드": "아몬드는 지방함량이 높지만 적당히 섭취하면 몸에 흡수되지 않으며 포만감을 줍니다.", "연어": "연어설명", "고등어": "고등어설명" };
  const minerals = { "양파": "양파에는 많은 무기질이 있어 혈당 조절, 인슐린 생성 촉진, 당뇨 예방에 좋습니다.", "버섯": "버섯설명", "토마토": "토마토설명" };

  const NUTRIENTS = [10, 60, 10, 40, 15];//서버에서 받을 영양소별 섭취량
  getData().then((result) => {
    accessToken = result[0];
    nameResult = result[1];
  });

  useEffect(() => {
    getData().then(([token, name]) => {
      setAccessToken(token);
      setNameResult(name);
    });
  }, []);
  console.log(nameResult);
  if (NUTRIENTS[0] < 50) {
    proteinR = Math.floor(Math.random() * Object.keys(protein).length)
    titleP = Object.keys(protein)[proteinR];
    subP = Object.values(protein)[proteinR];
  } else {
    titleP = "단백질은 충분합니다!"
    subP = ""
  }
  if (NUTRIENTS[1] < 50) {
    vitaminR = Math.floor(Math.random() * Object.keys(vitamin).length)
    titleV = Object.keys(vitamin)[vitaminR];
    subV = Object.values(vitamin)[vitaminR];
  } else {
    titleV = "비타민은 충분합니다!"
    subV = ""
  }
  if (NUTRIENTS[2] < 50) {
    carbonR = Math.floor(Math.random() * Object.keys(carbon).length)
    titleC = Object.keys(carbon)[carbonR];
    subC = Object.values(carbon)[carbonR];
  } else {
    titleC = "탄수화물은 충분합니다"
    subC = ""
  }
  if (NUTRIENTS[3] < 50) {
    provinceR = Math.floor(Math.random() * Object.keys(province).length)
    titlePV = Object.keys(province)[provinceR];
    subPV = Object.values(province)[provinceR];
  } else {
    titlePV = "지방은 충분합니다."
    subPV = ""
  }
  if (NUTRIENTS[4] < 50) {
    mineralsR = Math.floor(Math.random() * Object.keys(minerals).length)
    titleM = Object.keys(minerals)[mineralsR];
    subM = Object.values(minerals)[mineralsR];
  } else {
    titleM = "무기질은 충분합니다."
    subM = ""
  }
  const USERNAME = nameResult

  const data = [10, 20, 30, 40, 50, 60, 70];


  return (
    <View Style={styles.container}>
      <View style={[styles.firstContainer]}>
        <View style={styles.contentContainer}>
          <Text style={[styles.greeting, styles.text]}>안녕하세요</Text>
          <Text style={[styles.username, styles.text, { color: '#5f4ffe' }]}>
            {USERNAME}
          </Text>
          <Text style={[styles.greeting, styles.text]}>님!</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/default_profile.png')}
            style={styles.image}
          />
        </View>
      </View>

      <View style={styles.secondContainer}>
        <TouchableOpacity onPress={navigateToPhotoAnalysis}>
          <Image
            source={require('../../assets/Home_F.jpg')}
            style={styles.rectangleFood}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToVideoAnalysis}>
          <Image
            source={require('../../assets/Home_E1.jpg')}
            style={styles.rectangleVideo}
          />
        </TouchableOpacity>

      </View>

      {/* 세 번째 영역 */}
      <View style={[styles.thirdContainer]}>
        <ScrollView>
          <View style={styles.contentContainer}>
            <Text style={[styles.third_username, { color: '#5f4ffe' }]}>
              {USERNAME}
            </Text>
            <Text style={[styles.third_greeting,]}>님의 주간분석</Text>
            <View style={{ marginTop: -230, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={onNavigateToMore}>
                <Text style={styles.buttonText}>추천식단</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.nut, { color: '#5f4ffe' }]}>  비타민C</Text>
          <BarChart
            style={styles.chart}
            data={data}
            svg={{ fill: '#5f4ffe' }}
            spacingInner={0.6}
            spacingOuter={0.1}
            gridMin={5}
            animate
          >
            <XAxis
              style={{ marginHorizontal: -5, height: 200, marginTop: 160 }}
              data={data}
              formatLabel={(value, index) => labels[index]}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fontSize: 12, fill: 'black' }}
            />
          </BarChart>
          {/* 밑줄 추가 */}
          <View style={styles.chartFooterLine} />
          <Text style={{ marginTop: 60, marginLeft: SCREEN_WIDTH * 0.05, fontSize: 30, fontWeight: "bold", color: '#5f4ffe' }}>추천식단</Text>
          <ScrollView pagingEnabled horizontal style={styles.recFood} showsHorizontalScrollIndicator={false}>
            <View style={styles.recBlock}>
              <Text style={styles.foodName}>{titleP}</Text>
              <Text style={styles.foodDetail}>{subP}</Text>
              <Text style={styles.foodName}>{titleV}</Text>
              <Text style={styles.foodDetail}>{subV}</Text>
            </View>
            <View style={styles.recBlockNext}>
              <Text style={styles.foodName}>{titleC}</Text>
              <Text style={styles.foodDetail}>{subC}</Text>
              <Text style={styles.foodName}>{titlePV}</Text>
              <Text style={styles.foodDetail}>{subPV}</Text>
            </View>
            <View style={styles.recBlockNext}>
              <Text style={styles.foodName}>{titleM}</Text>
              <Text style={styles.foodDetail}>{subM}</Text>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  firstContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
  },
  username: {
    fontSize: 20,
    marginLeft: 4,
  },
  imageContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    marginLeft: 16,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  secondContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  rectangleFood: {
    width: 160,
    height: 90,
    marginBottom: 16,
    borderRadius: 10,
  },
  rectangleVideo: {
    width: 160,
    height: 90,
    marginBottom: 16,
    borderRadius: 10,
  },
  thirdContainer: {
    backgroundColor: '#F0F0F0',
    flex: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chart: {
    width: 340,
    height: 150,
  },
  third_greeting: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "flex-start",
  },
  third_username: {
    fontSize: 16,
    marginLeft: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  labelText: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#5f4ffe',
    fontSize: 18,
    marginTop: 250,
    marginBottom: 20,
    justifyContent: "flex-end",
    marginLeft: 120,
  },
  chartFooterLine: {
    borderTopWidth: 2,
    borderColor: 'black',
    width: '100%',
  },
  recFood: {
    marginTop: 20,
  },
  recBlock: {
    width: SCREEN_WIDTH,
    marginLeft: SCREEN_WIDTH * 0.05,
    marginRight: SCREEN_WIDTH * 0.05,
  },
  recBlockNext: {
    width: SCREEN_WIDTH,
    marginLeft: -SCREEN_WIDTH * 0.13,
    marginRight: SCREEN_WIDTH * 0.05,
  },
  foodName: {
    fontSize: 30,
    color: '#50a5ff',
    marginBottom: 10,
  },
  foodDetail: {
    fontSize: 15,
    color: 'black',
    marginBottom: 20,
    marginRight: SCREEN_WIDTH * 0.16,
  },
  nut: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Home;