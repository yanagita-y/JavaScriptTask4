'use strict';

const title = document.getElementById('title');
let quiz;
let quizCount = 0;
let correctCount = 0;

// スタートボタン押下時の処理
const startquiz = () => {
    title.textContent = "取得中";
    const message = document.getElementById('message');
    message.textContent = "少々お待ちください";
    start.style.display = 'none';
    start.textContent = '開始'
    // 次のクイズを表示
    quizCount = 0; // クイズカウントの初期化
    correctCount = 0; //正解カウントの初期化

    // クイズ用のAPIから取得
    fetch('https://opentdb.com/api.php?amount=10')
    .then(response => {
        return response.json(); // 👈 Promiseを返す
    })
    .then(data => { // 👈 JSONデータ
        // クイズデータの設定
        quiz = data;
        nextquiz();
    })
    .catch(error => { // 👈 エラーの場合
    console.log(error);
    });
}

// 次のクイズを表示する
const nextquiz = () => {
    // クイズエリアの取得
    const selection = document.getElementById('selection');

    // 問題文の表示
    title.textContent = `問題${quizCount+1}`;
    category.textContent = `[ジャンル]${quiz.results[quizCount].category}`;
    difficulty.textContent = `[難易度]${quiz.results[quizCount].difficulty}`;
    message.innerHTML = quiz.results[quizCount].question;

    // 正解を取得する
    const correct = quiz.results[quizCount].correct_answer;
    // 不正解を取得する
    const incorrect = quiz.results[quizCount].incorrect_answers;

    // 正解と不正解を混ぜる
    let answers = new Array();
    incorrect.forEach(function(e) {
        answers.push(e);
    });
    answers.push(correct);

    // ここでanswersの順番をランダムに変更する
    answers = shuffle(answers);

    // 選択肢を作る
    for (let i = 0; i < answers.length; i++) {
        // 選択の一つを作る
        const select = document.createElement("button");
        select.innerHTML = answers[i];
        
        // ボタンのイベントを設定する
        select.addEventListener('click', () => {
            //   ボタンのイベントでボタンのテキストと、答えを比較する
            if(select.textContent === correct){
                //     OK なら OKポイントを+1 する、
                correctCount++;
            }
            //       quizCountを+1する
            quizCount++;
            //       selectionの中身をクリア
            selection.innerHTML = '';
            // quizCountが10より小さいなら
            if(quizCount < 10){
                //       nextQuizを呼び出す   
                nextquiz();
            }else{
                // 違うならresultQuizを呼び出す
                resultQuiz();
            }
        })
        
        selection.appendChild(select);
    }
}

const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const resultQuiz = () => {
    title.textContent = `あなたの正解数は${correctCount}です！`;
    message.textContent = '再チャレンジしたい場合は以下をクリック';
    category.textContent = '';
    difficulty.textContent = '';
    start.style.display = 'block';
    start.textContent = 'ホームに戻る'
}
