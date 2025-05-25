import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from './supabase-setting.ts';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './index.css'

const questionslist = [
  {
    "qid" : "1",
    "qtext" : "あなたは…",
    "options" : ["0. 猫派" , "1. 犬派"]
  },
  {
    "qid" : "2",
    "qtext" : "あなたは休日には…",
    "options" : ["オンラインでゲームをしたりネットサーフィンをしたい" , "パソコンやスマホから離れてオフラインで過ごしたい"]
  },
  {
    "qid" : "3",
    "qtext" : "あなたがパートナーに対して重視するのは…",
    "options" : ["年齢" , "一途"]
  },
  {
    "qid" : "4",
    "qtext" : "あなたは…",
    "options" : ["０から何かを生み出すのが好き" , "事柄をイチから考えるのが好き"]
  },
  {
    "qid" : "5",
    "qtext" : "あなたは死後の世界が…",
    "options" : ["存在すると思う" , "存在しないと思う"]
  },
  {
    "qid" : "6",
    "qtext" : "あなたは問診票のチェックボックスに YES と答えたいとき…",
    "options" : ["スラッシュを書く" , "丸で囲う"]
  },
  {
    "qid" : "7",
    "qtext" : "あなたには過去に何度でも戻れる能力があるとして，ある日とてもつらいことが起きたら…",
    "options" : ["つらいことが起きる以前を何度もループする" , "つらいことが起きても人生をまっすぐ生きていく"]
  },
  {
    "qid" : "8",
    "qtext" : "あなたは半分以上の方を選ぶか？",
    "options" : ["選択肢A" , "選択肢B"]
  },
  {
    "qid" : "9",
    "qtext" : "あなたが思う味噌汁に欠かせない具材は…",
    "options" : ["ねぎ" , "わかめ" , "ふ"]
  },
  {
    "qid" : "10",
    "qtext" : "労働者であるあなたが一番大切にしたいのは…",
    "options" : ["メーデー" , "子供心" , "無垢" , "母" , "父"]
  },
  {
    "qid" : "11",
    "qtext" : "あなたがかけられて一番励まされる言葉は…",
    "options" : ["失敗しても大丈夫" , "みんな君を応援しているよ" , "冷静になってやればうまくいく" , "そこまで頑張れたあなたならきっと乗り越えられる" , "ファイト！" , "どんなに今が苦しくてもいつか報われる日が来る" , "ラクをしない道をあえて選んでいるあなたは最高にかっこいい"]
  },
  {
    "qid" : "12",
    "qtext" : "あなたを最も表していると思う漢字は…",
    "options" : ["心" , "謎" , "才" , "尽" , "眠" , "楽" , "陰" , "疑" , "徹" , "賢" , "一" , "狂" , "独" , "力" , "幼" , "炎" , "善"]
  },
  {
    "qid" : "13",
    "qtext" : "あなたがピンと来る4文字は…",
    "options" : ["ESTP" , "ESTJ" , "ENTJ" , "ENTP" , "ISTP" , "ISTJ" , "INTJ" , "INTP" , "ESFP" , "ESFJ" , "ENFJ" , "ENFP" , "ISFP" , "ISFJ" , "INFJ" , "INFP"]
  },
];

type AnswerConvType = {
  qid : string,
  conv : Record<string, number>,
};

const convertanswer : AnswerConvType[] = [ // ちゃんとここで型言っておかないと obj2.conv[ans] のときに ans のstring参照が型安全じゃないって怒られる；；
  {
    "qid" : "1",
    "conv" : {"0. 猫派" : 0 , "1. 犬派" : 1}
  },
  {
    "qid" : "2",
    "conv" : {"オンラインでゲームをしたりネットサーフィンをしたい" : 1 , "パソコンやスマホから離れてオフラインで過ごしたい" : 0}
  },
  {
    "qid" : "3",
    "conv" : {"年齢" : 0 , "一途" : 1}
  },
  {
    "qid" : "4",
    "conv" : {"０から何かを生み出すのが好き" : 0 , "事柄をイチから考えるのが好き" : 1}
  },
  {
    "qid" : "5",
    "conv" : {"存在すると思う" : 1 , "存在しないと思う" : 0}
  },
  {
    "qid" : "6",
    "conv" : {"スラッシュを書く" : 1 , "丸で囲う" : 0}
  },
  {
    "qid" : "7",
    "conv" : {"つらいことが起きても人生をまっすぐ生きていく" : 1 , "つらいことが起きる以前を何度もループする" : 0}
  },
  {
    "qid" : "8",
    "conv" : {"選択肢A" : -1 , "選択肢B" : -1}
  },
  {
    "qid" : "9",
    "conv" : {"ふ" : 1 , "ねぎ" : 2 , "わかめ" : 3}
  },
  {
    "qid" : "10",
    "conv" : {"母" : 1 , "父" : 2 , "無垢" : 3 , "メーデー" : 4 , "子供心" : 5}
  },
  {
    "qid" : "11",
    "conv" : {"どんなに今が苦しくてもいつか報われる日が来る" : 1 , "冷静になってやればうまくいく" : 2 , "みんな君を応援しているよ" : 3 , "ファイト！" : 4 , "そこまで頑張れたあなたならきっと乗り越えられる" : 5 , "ラクをしない道をあえて選んでいるあなたは最高にかっこいい" : 6 , "失敗しても大丈夫" : 7}
  },
  {
    "qid" : "12",
    "conv" : {"一" : 1 , "力" : 2 , "才" : 3 , "心" : 4 , "幼" : 5 , "尽" : 6 , "狂" : 7 , "炎" : 8 , "独" : 9 , "眠" : 10 , "陰" : 11 , "善" : 12 , "楽" : 13 , "疑" : 14 , "徹" : 15 , "賢" : 16 , "謎" : 17}
  },
  {
    "qid" : "13",
    "conv" : {"ESTP" : 1 , "ESTJ" : 2 , "ENTJ" : 3 , "ENTP" : 4 , "ISTP" : 5 , "ISTJ" : 6 , "INTJ" : 7 , "INTP" : 8 , "ESFP" : 9 , "ESFJ" : 10 , "ENFJ" : 11 , "ENFP" : 12 , "ISFP" : 13 , "ISFJ" : 14 , "INFJ" : 15 , "1INFP" : 16}
  },
]

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type allanswerstype = {
  id : number,
  qid : string,
  ans : string,
};

let countsperqid : {[key : string] : number} = {
  "1" : 0,
  "2" : 0,
  "3" : 0,
  "4" : 0,
  "5" : 0,
  "6" : 0,
  "7" : 0,
  "8" : 0,
  "9" : 0,
  "10" : 0,
  "11" : 0,
  "12" : 0,
  "13" : 0,
} 

let countsperans : {[key : string] : number} = {
  "選択肢A" : 0,
  "選択肢B" : 0,
}

let qidperans : {[key : string] : string} = {

}

function App() {
  // answers はstringをkeyとして値がkeyの連想配列 Object
  const [answers , setAnswers] = useState<{[key : string] : string}>({})
  const [personality , setPersonality] = useState<string>("");
  const [submitted , setSubmitted] = useState(false);

  const [_allanswers , setAllanswers] = useState<allanswerstype[]>([])

  useEffect(() => {
    getAnswersList();
  } , []); // [] にすることでコンポーネントの props や state が変更された場合でも再実行されない
  
  // データベース接続は非同期で行う(同期だと通信が終わるまでUI固まるとかになっちゃう)　→ async , await の組合せ
  const getAnswersList = async() => {
    const {data , error} = await supabase.from("answerslist").select("*");
    setAllanswers(_allanswers => (data || [])); // data が空の場合も今後allanswersを取得するときにバグらないように
    
    if(error){
      console.log("Fetch Failed :(");
    }

    (data || []).forEach(({qid , ans}) => { // 過去の回答を全て記録
      countsperqid[qid] = (countsperqid[qid] ? countsperqid[qid] + 1 : 1);
      countsperans[ans] = (countsperans[ans] ? countsperans[ans] + 1 : 1);
      qidperans[ans] = (qidperans[ans] ? qidperans[ans] : qid);
    })

    if(countsperans["選択肢A"] < countsperans["選択肢B"]){
      convertanswer[7].conv["選択肢A"] = 0;
      convertanswer[7].conv["選択肢B"] = 1;
    }
    else if(countsperans["選択肢A"] > countsperans["選択肢B"]){
      convertanswer[7].conv["選択肢A"] = 1;
      convertanswer[7].conv["選択肢B"] = 0;
    }
    else{
      convertanswer[7].conv["選択肢A"] = 1;
      convertanswer[7].conv["選択肢B"] = 1;
    }

    console.log(data || []);
    console.log(countsperans);
    console.log(countsperqid);
    console.log(qidperans);
  };

  const radioclick = (qid : string , value : string) => {
    setAnswers(sta => ({...sta , [qid] : value}));
  }

  const submitclick = async() => {
    var ret = 0;
    // まずは Q7 までの加算を行う
    Object.entries(answers).forEach(([qid , ans] : [string , string]) => { // answers[qid] = ans
      const obj2 = convertanswer.find((item) => item.qid == qid);
      var idx = Number(qid);
      if(idx <= 7 && obj2 && obj2.conv !== undefined){ // obj2 が undefined かもしれないので obj2 && を足す
        var plus = obj2.conv[ans];
        var plus2 = (plus << (idx-1));
        ret += plus2;
      }
      else if(idx == 8 && obj2 && obj2.conv !== undefined){ // Q8 は他回答者によって変わる
        var plus = obj2.conv[ans];
        if(plus == -1){
          plus = 1;
        }
        var plus2 = (plus << (idx-1));
        ret += plus2;
      }
    })

    // Q9 ~ Q12 までの積算を行う
    Object.entries(answers).forEach(([qid , ans]) => { // answers[qid] = ans
      const obj2 = convertanswer.find((item) => item.qid == qid);
      var idx = Number(qid);
      if(idx >= 9 && idx <= 12 && obj2 && obj2.conv !== undefined){ // obj2 が undefined かもしれないので obj2 && を足す
        var times = obj2.conv[ans];
        ret *= times;
      }
    })

    // Q13 の加算を行う
    Object.entries(answers).forEach(([qid , ans]) => { // answers[qid] = ans
      const obj2 = convertanswer.find((item) => item.qid == qid);
      var idx = Number(qid);
      if(idx == 13 && obj2 && obj2.conv !== undefined){ // obj2 が undefined かもしれないので obj2 && を足す
        var plus = obj2.conv[ans];
        ret += plus;
      }
    })

    console.log(ret);
    ret--;

    var res_personality : string = "";
    res_personality += letters[Math.floor(ret/(26*26*26))];
    ret %= (26*26*26);
    res_personality += letters[Math.floor(ret/(26*26))];
    ret %= (26*26);
    res_personality += letters[Math.floor(ret/(26))];
    ret %= (26);
    res_personality += letters[ret];

    setPersonality(_prev => (res_personality));
    setSubmitted(_prev => (true));

    const insertanswers = Object.entries(answers).map(([qid , ans]) => ({
      qid,
      ans,
    })); // answersから qid:"1" ans:"～～～" を拾って {qid:"1" , ans:"～～～"} の形でinsertanswersに返す

    const {data} = await supabase.from("answerslist").insert(insertanswers);
    console.log("Insert Success!" , data);

  }

  if(submitted){
    const tweettxt = "診断結果：" + personality + (personality == "AAAA" ? "\n仕組みを理解し見事 AAAA と診断された！" : "") + (personality == "INFP" ? "\n全てを理解し大変な作業をし見事，自分の直観と診断結果を一致させた！" : "") + "\n\nあなたも 4 文字を診断→ https://26p4personalities.vercel.app/\n\n#26p4Personalities";
    const tweeturl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweettxt)}`;
    return (
      <>
        <h1>
          あなたの 4文字 は…
        </h1>
        <h1>
          {personality}
        </h1>
        <button onClick={() => {window.open(tweeturl , "_blank")}} className="mt-10 bg-white text-black px-4 py-2">
          診断結果を X で呟く
        </button>
        <h2 className="mt-10">
          【挑戦１】診断の仕組みを理解し「AAAA」と診断されよう。
            <br></br>
          【挑戦２】Q13で選んだ4文字と最終的な診断結果を一致させよう（多くの作業を必要とします）。
        </h2>
      </>
      
    )
  }

  // @types/react が混ざって class だとエラー吐く className にしないとダメ
  return (
    <React.Fragment>
      
    <div>
      <h1> 26^4 Personalities! </h1>

      {questionslist.map((q) => (
        <>
          {q.qid == "1" ? 
            <div className="bg-red-800 px-3 py-3 mt-10 rounded text-[22px]">
              Question. 1 ~ Question. 8<br/>あなたの回答を加味して診断します。
            </div>
            : <div></div>
          }
          
          {q.qid == "9" ? 
            <div className="bg-red-800 px-3 py-3 mt-10 rounded text-[22px]">
              Question. 9 ~ Question. 12<br/>あなたの回答のデータを積み重ねて分析し，あなたにピッタリな診断をします。
            </div>
            : <div></div>
          }

          {q.qid == "13" ? 
            <div className="bg-red-800 px-3 py-3 mt-10 rounded text-[22px]">
              Question. 13<br/>最後にあなたが何番目を選択したかを分析データに加え，最終的な診断を行います。
            </div>
            : <div></div>
          }

          <div key={q.qid} className="mt-10 bg-green-800 px-3 py-3 rounded"> 
            <div className="mb-5 bg-blue-100 font-bold text-black text-[30px] rounded"> Question. {q.qid}　{q.qtext} </div>
            {q.options.map((opt) => (
              <label key={opt} className="block">
                <input 
                  type="radio"
                  name={q.qid}
                  value={opt} 
                  checked={answers[q.qid] === opt}
                  onChange={() => radioclick(q.qid , opt)}
                  className="text-[25px]"
                />
                {opt} / ({countsperqid[qidperans[opt]] != 0 ? Math.round(countsperans[opt] / countsperqid[qidperans[opt]] * 100) : 0} %)
              </label>

            ))}
          </div>

          
        </>

      ))}

      <button type="button" onClick={() => submitclick()} disabled={Object.keys(answers).length != 13} className="bg-blue-500 mt-10 ">
        {Object.keys(answers).length == 13 ? 
          "回答を送信して診断結果を見る"
          :
          "未回答の質問があります"
        }
        
      </button>

    </div>

    </React.Fragment>
  )
}

export default App
