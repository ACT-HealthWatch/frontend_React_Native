import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { tellExName } from './Video';

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const getData = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log('accessToken:', accessToken);
  } catch (error) {
    console.error('Error getting data:', error);
  }
};
let CORRECTION_INDEX1 = "팔이 너무 벌어져있습니다. 양팔을 어깨너비로 벌리고 편하게 엎드리세요. \n\n무릎이 접혀져있습니다. 무릎을 피고 힘을 풀지 마세요.\n\n엉덩이가 위로 올라와있습니다. 복부에 힘을 주고 다시 해보세요."//서버에서 받을 내용
const CORRECTION_INDEX2 = "발이 고정되어있지 않습니다. 우선 발을 고정시키고 무릎은 접은 상태에서 윗몸을 일으켜주세요. \n\n등이 구부러져있습니다. 등을 구부리지 않고 바르게 곧추 세운 상태에서 그대로 일어나주세요."
const CORRECTION_INDEX3 = "발 사이의 거리가 너무 좁습니다. 발을 어꺠넓이로 벌려주세요.\n\n허리가 굽혀져있습니다. 등과 가슴을 편다는 느낌으러 서주세요.\n\n상체가 뒤로 기울어있습니다. 상체를 앞으로 기울이고 고관절을 접어 엉덩이를 뒤로 빼며 내려가세요/"
const UNKNOWN_INDEX = "운동을 인식할 수 없거나 아직 업로드되지 않은 상태입니다. 영상을 다시 업로드하거나 재촬영 해주십시오."
//const exercise = [plank, pushup, pullup, planche, situp, squat, dips, burpee, bridge, lunge];
//운동 종목:종목메뉴얼 방식으로 딕셔너리 제작 예정
let PLANK_MANUAL = "1. 엎드린 자세에서 팔뚝으로 중심을 잡고 다리는 약간 벌린 상태로 일자를 유지한다. 몸은 전체에 걸쳐 일자상태를 유지한다.\n\n2. 팔꿈치와 어깨는 일자를 유지한다.\n\n3. 복부에 힘을 주고 몸을 앞으로 들어 올린다. 수축을 몇 초간 유지한다. 턱은 약간 잡아당긴다. 운동을 실시하는 동안 복근을 계속 수축하게 한다. 의식적으로 힘을 주면서 복부의 모든 근육에 대해 집중하면서 운동하는 것이 매우 중요하다. 그것과 동시에 둔부에 힘을 주고 발가락을 바닥에 지지대 삼아 뒤꿈치를 밀어 주면서 하체 전체를 뒤로 밀어내는 감각으로 뻗으면 엉덩이도 자연스럽게 내려오고 어깨와 팔에 하중이 경감된다. 고개는 너무 떨구는 일이 없도록 한다.\n\n4. 이 자세를 최소 15초 동안 유지한다."
const SITUP_MANUAL = "*잘못된 윗몸일으키기는 허리에 부담을 줄 수 있습니다. 주의해주세요* \n\n1. 푹신한 자리에 눕는다.\n\n2. 양 손을 머리 뒤로 깍지낀다.\n\n3. 다리를 고정시킨 상태로 상체를 앞으로 굽혔다가 팔꿈치와 무릎이 닿고 다시 내려가는 것을 반복한다.\n\n3-1. 앞의 방법이 허리에 부담이 된다면 중간까지만 올렸다가 다시 내리는 방법으로 반복한다."
const SQUAT_MANUAL = "1. 차렷 자세에서 양발을 어깨너비로 벌린다.\n\n2. 양손은 깍지를 끼거나 앞으로 나란이를 한다.\n\n3. 양발 끝은 바깥쪽으로 15~20도 정도 벌려준다.\n\n4. 상체를 그대로 꼿꼿이 유지하면서 천천히 엉덩이를 뒤로 뺀다.\n\n5. 그와 동시에 천천히 무릎을 굽히면서 의자에 앉듯이 앉는다.\n\n6. 옆에서 봤을 때 허벅지가 바닥과 평행이 될 정도까지 앉는다.\n\n7. 엉덩이를 뒤로 빼면서 앉는데 무릎이 발끝을 넘어가는 건 괜찮다.\n\n8. 그리고 다시 준비 자세로 돌아온다.\n\n9. 호흡은 편하게 숨을 쉬어도 괜찮고 내려갈 때 마시고 올라올 때 뱉어도 좋다."
const UNKNOWN_MANUAL = "운동을 인식할 수 없거나 아직 업로드되지 않은 상태입니다. 영상을 다시 업로드하거나 재촬영 해주십시오."
export default function Video_Analysis() {
  let exName = tellExName()
  console.log("h")
  console.log(exName)
  if (exName == "plank") {
    CORRECTION_INDEX1 = CORRECTION_INDEX1
    PLANK_MANUAL = PLANK_MANUAL
  } else if (exName == "situp") {
    CORRECTION_INDEX1 = CORRECTION_INDEX2
    PLANK_MANUAL = SITUP_MANUAL
  } else if (exName == "squat") {
    CORRECTION_INDEX1 = CORRECTION_INDEX3
    PLANK_MANUAL = SQUAT_MANUAL
  } else {
    CORRECTION_INDEX1 = UNKNOWN_INDEX
    PLANK_MANUAL = UNKNOWN_MANUAL
  }
  if (exName == "plank") {
    exName = "플랭크"
  } else if (exName == "situp") {
    exName = "윗몸일으키기"
  } else if (exName == "squat") {
    exName = "스쿼트"
  } else {
    exName = "영상이 업로드되지 않았거나 분석되지 않는 형태의 운동입니다."
  }

  return (
    <View>
      <Image
        source={require('../../assets/Plank.jpg')}
        style={styles.imageE} />
      <View style={styles.correction}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.correctionTitle}>
            교정사항
          </Text>
          <Text style={styles.correctionSub}>
            {CORRECTION_INDEX1}
          </Text>
        </ScrollView>
      </View>
      <View style={styles.manual}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.manualTitle}>
            {exName}
          </Text>
          <Text style={styles.manualSub}>
            {PLANK_MANUAL}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageE: {
    flex: 1,
    width: SCREEN_HEIGHT / 2.4,
    borderRadius: 20,
    marginBottom: 10,
  },
  correction: {
    flex: 1,
    width: SCREEN_HEIGHT / 2.4,
    backgroundColor: '#E2E2E2',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  correctionTitle: {
    fontSize: 25,
    color: '#50a5ff',
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: "flex-start",
    fontWeight: 'bold'
  },
  correctionSub: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  manual: {
    flex: 2,
    width: SCREEN_HEIGHT / 2.4,
    backgroundColor: '#E2E2E2',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  manualTitle: {
    color: '#5f4ffe',
    fontSize: 25,
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: "flex-start",
    fontWeight: 'bold'
  },
  manualSub: {

    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },


});