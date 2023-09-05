import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api_uri } from '@env';
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Photo_Analysis = ({ onNavigateToPhoto }) => {
  const [proteinData, setProteinData] = useState([1, 1, 1, 1]);
  const [foodName, setFoodName] = useState(''); 
  const [weekproteinData, setWeekProteinData] = useState([1, 1, 1, 1]);
  let [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('foodName')
      .then((value) => {
        if (value) {
          setFoodName(value);
          init(value);
        } else {
          setFoodName('');
          init('');
        }
      })
      .catch((error) => {
        console.error('Error getting data:', error);
        setFoodName('');
        init('');
      });
  }, []);


  const getData = async () => {
    try {
      const accessTokenValue = await AsyncStorage.getItem('accessToken');

      return [accessTokenValue];
    } catch (error) {
      console.error('Error getting data:', error);
      return [null, null];
    }
  };
  useEffect(() => {
    getData().then(([token]) => {
      setAccessToken(token);
    });
  }, []);


  const init = async (foodName) => {
    try {
      let flag = true
      function composeUnicode(combined) {
        return combined.normalize('NFC');
      }
      var composed = composeUnicode(foodName);
      const response = await (await fetch(`http://openapi.foodsafetykorea.go.kr/api/415756d599f247a1bc19/I2790/json/1/1000/DESC_KOR=${composed}`)).json();
      let fetchedProteinData = [1, 1, 1, 1];
      for (let item of response.I2790.row) {
        if (item.DESC_KOR === foodName) {
          
          if(item.NUTR_CONT1 === "" || item.NUTR_CONT2 === "" || item.NUTR_CONT3 === "" || item.NUTR_CONT4 === ""){
            return;
          }
          fetchedProteinData = [item.NUTR_CONT1, item.NUTR_CONT2, item.NUTR_CONT4, item.NUTR_CONT3];
          flag = false;
          break;
        }
      }
      if (flag) {
        
        fetchedProteinData = [response.I2790.row[0].NUTR_CONT1, response.I2790.row[0].NUTR_CONT2, response.I2790.row[0].NUTR_CONT4, response.I2790.row[0].NUTR_CONT3];
      }
      setProteinData(fetchedProteinData);

      // 음식 정보를 서버로 보내는 함수 호출
      postFoodData(fetchedProteinData);
    } catch (e) {
      console.log("데이터가 없습니다");
    }
  };

  const postFoodData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(
        api_uri + '/api/v1/user/nutrient/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            kcal: parseFloat(proteinData[0]),
            carbohydrate: parseFloat(proteinData[1]),
            protein: parseFloat(proteinData[2]),
            fat: parseFloat(proteinData[3]),
          }),
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        console.log('음식 데이터 전송 성공');
      } else {
        console.log('음식 데이터 전송 실패');
      }
    } catch (error) {
      console.error('음식 데이터 전송 중 오류:', error);
    }
  };
  

  const fetchWeekData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
  
      if (!accessToken) {
        console.error('Access token is missing.');
        return;
      }
  
      const url = api_uri + '/api/v1/user/nutrient/weekly';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  
      if (response.status === 200) {
        const responseJson = await response.json();
        console.log('주간 데이터 가져오기 성공', responseJson);
  
        if (responseJson.length > 0) {
          // 배열의 첫 번째 객체에서 값을 가져와서 state를 업데이트합니다.
          const firstItem = responseJson[0];
          setWeekProteinData([
            firstItem.total_kcal,
            firstItem.total_carbs,
            firstItem.total_protein,
            firstItem.total_fat,
          ]);
          //아래 코드는 api 엔드포인드가 weekly가 아닌 all일때 사용
          // setWeekProteinData([
          //   firstItem.kcal,
          //   firstItem.carbohydrate,
          //   firstItem.protein,
          //   firstItem.fat,
          // ]);
        }
      } else {
        console.error('주간 데이터 가져오기 실패:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  
  
  useEffect(() => {
    fetchWeekData();
  }, []);
  


  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.firstContainer}>
        <TouchableOpacity onPress={onNavigateToPhoto}>
          <Text style={styles.text}>카메라</Text>
        </TouchableOpacity>
        <Text style={styles.text}>식품분석</Text>
      </View>

      <View style={styles.secondContainer}>
        <Text style={styles.middleText}>{foodName}</Text>
      </View>

      <View style={styles.thirdContainer}>
        <View style={styles.nutritionInfo}>
          <NutritionInfo label="칼로리" value={proteinData[0] + "kcal"} />
          <NutritionInfo label="탄수화물" value={proteinData[1] + "g"} />
          <NutritionInfo label="지방" value={proteinData[2] + "g"} />
          <NutritionInfo label="단백질" value={proteinData[3] + "g"} />
        </View>
      </View>

      <View style={styles.fourthContainer}>
        <Text style={styles.secondmiddleText}>주간 분석</Text>
      </View>

      <View style={styles.fifthContainer}>
        <View style={styles.nutritionInfo2}>
          <NutritionInfo2 label="칼로리" value={weekproteinData[0] + " kcal"} />
          <NutritionInfo2 label="탄수화물" value={weekproteinData[1] + "g"} />
          <NutritionInfo2 label="지방" value={weekproteinData[2] + "g"} />
          <NutritionInfo2 label="단백질" value={weekproteinData[3] + "g"} />
        </View>

      </View>
    </ScrollView>
  );
};

const NutritionInfo = ({ label, value }) => (
  <View style={styles.nutritionInfoItem}>
    <View style={styles.nutritionInfoItemLabel}>
      <Text style={styles.nutritionLabel}>{label}</Text>
    </View>
    <View style={styles.nutritionInfoItemValue}>
      <Text style={styles.nutritionValue}>{value}</Text>
    </View>
  </View>
);
const NutritionInfo2 = ({ label, value }) => (
  <View style={styles.nutritionInfoItem}>
    <View style={styles.nutritionInfoItemLabel}>
      <Text style={styles.nutritionLabel}>{label}</Text>
    </View>
    <View style={styles.nutritionInfoItemValue}>
      <Text style={styles.nutritionValue2}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 50,
  },
  firstContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.01,
    marginLeft: SCREEN_WIDTH * 0.02,
    marginRight: SCREEN_WIDTH * 0.39,
  },
  secondContainer: {
    flex: 0.1,
    marginTop: 30,
  },
  thirdContainer: {
    flex: 5,
    marginBottom: 10,
    width: SCREEN_HEIGHT / 2.4,
    backgroundColor: '#E2E2E2',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    padding: 20,
  },
  fourthContainer: {
    flex: 0.1,
    marginBottom: 10,
  },
  fifthContainer: {
    flex: 5,
    marginBottom: 10,
    width: SCREEN_HEIGHT / 2.4,
    backgroundColor: '#E2E2E2',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  middleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#50a5ff',
  },
  secondmiddleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  nutritionInfo: {
    flexDirection: 'column', // 세로로 정렬
    alignItems: 'center',
  },
  nutritionInfoItem: {
    flexDirection: 'row', // 가로로 정렬
    justifyContent: 'space-between', // 라벨과 값 사이의 간격을 벌립니다.
    marginVertical: 12, // 각 항목을 위아래로 여백을 줍니다.
    alignItems: 'center',
  },
  nutritionInfoItemLabel: {
    flex: 1, // 라벨 영역이 화면 너비의 절반을 차지하도록 설정
  },
  nutritionInfoItemValue: {
    flex: 1, // 수치 영역이 화면 너비의 절반을 차지하도록 설정
    alignItems: 'flex-end', // 수치를 오른쪽으로 정렬
  },
  nutritionLabel: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  nutritionValue: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#50a5ff',
  },
  nutritionValue2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#5f4ffe',
  },
});

export default Photo_Analysis;