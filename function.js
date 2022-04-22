'use strict';

//クイズクラス
class Quiz {
    constructor(quizData) {
      this._quizzes = quizData.results;
      this._correctAnswersNum = 0;
    }
  
    // クイズのジャンルを取得する
    getQuizCategory(index) {
        return this._quizzes[index].category;
    }
    // クイズの難易度を取得する
    getQuizDifficulty(index) {
        return this._quizzes[index].difficulty;
    }
    // クイズの問題文を取得する
    getQuizQuestion(index) {
        return this._quizzes[index].question;
    }
    // 正解を取得する
    getQuizCorrectAnswers(index) {
        return this._quizzes[index].correct_answer;
    }
    // 不正解を取得する
    getQuizIncorrectAnswers(index) {
        return this._quizzes[index].incorrect_answers;
    }
}


async function startQuiz() {
    title.textContent = '取得中';
    const message = document.getElementById('message');
    message.textContent = '少々お待ちください';
    start.style.display = 'none';
    start.textContent = '開始'

    // クイズ用のAPIから取得
    try{
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        const data = await response.json(); // 👈 Promiseを返す
        const quiz = new Quiz(data);
        viewQuiz(0,quiz);
    } catch(err) {  // 👈 エラーの場合
        alert(err);
    }
}

const viewQuiz = (index,quiz) => {
    // クイズエリアの取得
    const selection = document.getElementById('selection');
    // 問題文の表示
    title.textContent = `問題${index+1}`;
    category.textContent = `[ジャンル]${quiz.getQuizCategory(index)}`;
    difficulty.textContent = `[難易度]${quiz.getQuizDifficulty(index)}`;
    message.innerHTML = quiz.getQuizQuestion(index);

    const correct = quiz.getQuizCorrectAnswers(index);
    const incorrect = quiz.getQuizIncorrectAnswers(index);
    // 正解と不正解を混ぜる
    const answers = incorrect;
    answers.push(correct);
    answers.sort();

    for(let l=0 ; l < answers.length ; l++ ){
        const select = document.createElement("button");
        select.innerHTML = answers[l];
        selection.appendChild(select);
        // ボタンのイベントを設定する
        select.addEventListener('click', () => {
            // ボタンのイベントでボタンのテキストと、答えを比較する
            if(select.textContent === correct){
                // OK ならポイントを+1 する、
                quiz._correctAnswersNum++;
            }
            // selectionの中身をクリア
            selection.innerHTML = '';
            // quizCountが10より小さいなら
            if(index < 9){
                // viewQuizを呼び出す
                viewQuiz(index+1,quiz);
            }else{
                // 違うならresultQuizを呼び出す
                resultQuiz(quiz);
            }
        })
    }
}

const resultQuiz = (quiz) => {
    title.textContent = `あなたの正解数は${quiz._correctAnswersNum}です！`;
    message.textContent = '再チャレンジしたい場合は以下をクリック';
    category.textContent = '';
    difficulty.textContent = '';
    restart.style.display = 'block';
    window.onload;
}

// 画面初期化イベント
window.onload = () => {
    // クイズ開始ボタンにクリックイベントの登録
    start.addEventListener('click', () =>{
        // クイズクラスのクイズ開始メソッドを呼び出す
        startQuiz();
    });
    // ホームに戻るにクリックイベントの登録
    restart.addEventListener('click', () => {
        // クイズクラスのリスタートメソッドを呼び出す
        window.location.reload();
    })
}