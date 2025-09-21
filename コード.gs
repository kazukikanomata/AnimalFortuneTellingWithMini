// スタンドアローン　スプシのID
const bookId = "1hblCGxMKpMbXZqhJ0l0a_LUxhE4ZhPa0Uby7heyDF3I";

const urlMap = {
  dog: "https://mininome.com/tokuisagashi/animal-dog/",
  cat: "https://mininome.com/tokuisagashi/animal-cat/",
  rabbit: "https://mininome.com/tokuisagashi/animal-rabbit/",
  dolphin: "https://mininome.com/tokuisagashi/animal-dolphin/",
  fox: "https://mininome.com/tokuisagashi/animal-fox/",
  panda: "https://mininome.com/tokuisagashi/animal-panda/",
  lion: "https://mininome.com/tokuisagashi/animal-lion/",
  swan: "https://mininome.com/tokuisagashi/animal-swan/",
};

/**
 * ユーザーが最初にアクセスしたときに実行される
 * @returns
 */
const doGet = () => {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("アンケート")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
};

// ロジック
// 1: スプシ記載
// 2: スコア計算
// 3: 結果表示

/**
 * ユーザーがフォーム送信を実行後に実行される
 * @param ニックネーム、アンケート項目
 */

// スプシへ記載する処理
const saveToSheet = (data) => {
  console.log(JSON.stringify(data));
  const sheet = SpreadsheetApp.openById(bookId).getSheetByName("回答");
  if (!sheet) throw new Error("シートが見つかりません");

  const values = [
    new Date(),
    data.nickname,
    data.q1.text,
    data.q2.text,
    data.q3.text,
    data.q4.text,
    data.q5.text,
    data.q6.text,
    data.q7.text,
    data.q8.text,
    data.q9.text,
    data.q10.text,
    data.q11.text,
    data.q12.text,
  ];

  sheet.appendRow(values);
};

// 計算をする処理
const calculateResult = (data) => {
  const scoreMap = {
    A1: ["dolphin", "panda"],
    B1: ["rabbit", "fox"],
    C1: ["dog", "lion"],
    D1: ["cat", "swan"],
    A2: ["cat", "swan"],
    B2: ["dolphin", "rabbit"],
    C2: ["fox", "lion"],
    D2: ["panda", "dog"],
    A3: ["dog", "rabbit"],
    B3: ["lion", "dolphin"],
    C3: ["fox", "swan"],
    D3: ["panda", "cat"],
    A4: ["rabbit", "fox"],
    B4: ["panda", "cat"],
    C4: ["swan", "dolphin"],
    D4: ["dog", "lion"],
    A5: ["rabbit", "dog"],
    B5: ["cat", "dolphin"],
    C5: ["fox", "swan"],
    D5: ["lion", "panda"],
    A6: ["lion", "fox"],
    B6: ["rabbit", "swan"],
    C6: ["dolphin", "dog"],
    D6: ["cat", "panda"],
    A7: ["dog", "rabbit"],
    B7: ["panda", "cat"],
    C7: ["swan", "fox"],
    D7: ["dolphin", "lion"],
    A8: ["lion", "dolphin"],
    B8: ["swan", "dog"],
    C8: ["rabbit", "fox"],
    D8: ["cat", "panda"],
    A9: ["swan", "cat"],
    B9: ["dog", "rabbit"],
    C9: ["dolphin", "panda"],
    D9: ["lion", "fox"],
    A10: ["rabbit", "swan"],
    B10: ["fox", "cat"],
    C10: ["panda", "dolphin"],
    D10: ["lion", "dog"],
    A11: ["swan", "panda"],
    B11: ["cat", "dolphin"],
    C11: ["fox", "rabbit"],
    D11: ["dog", "lion"],
    A12: ["dolphin", "dog"],
    B12: ["swan", "cat"],
    C12: ["fox", "rabbit"],
    D12: ["panda", "lion"],
  };

  const types = [
    "dog",
    "cat",
    "rabbit",
    "dolphin",
    "fox",
    "panda",
    "lion",
    "swan",
  ];
  const score = {};
  const majorCount = {};

  types.forEach((t) => {
    score[t] = 0;
    majorCount[t] = 0;
  });

  const answers = [
    data.q1.value,
    data.q2.value,
    data.q3.value,
    data.q4.value,
    data.q5.value,
    data.q6.value,
    data.q7.value,
    data.q8.value,
    data.q9.value,
    data.q10.value,
    data.q11.value,
    data.q12.value,
  ];

  for (let i = 0; i < answers.length; i++) {
    const key = answers[i];
    const pair = scoreMap[key];
    if (!pair) continue;
    const [main, sub] = pair;
    score[main] += 3;
    score[sub] += 1;
    majorCount[main] += 1;
  }

  // ▼ 最大スコアのタイプ判定
  const maxScore = Math.max(...Object.values(score));
  const topTypes = types.filter((t) => score[t] === maxScore);

  let finalType = topTypes[0];

  // 同点の場合、主要タイプの数が多い方
  if (topTypes.length > 1) {
    let maxMajor = -1;
    topTypes.forEach((t) => {
      if (majorCount[t] > maxMajor) {
        maxMajor = majorCount[t];
        finalType = t;
      }
    });
  }
  return urlMap[finalType] || "";
};

const handleFormSubmit = (data) => {
  saveToSheet(data);
  const resultUrl = calculateResult(data);
  return resultUrl;
};
