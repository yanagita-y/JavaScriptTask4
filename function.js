'use strict';

// クイズクラス
class Quiz {
    // メンバー変数
    // タイトル
    title = document.getElementById('title');
    // クイズデータ本体
    quiz = {};
    // クイズ番号
    quizCount = 0;
    // クイズ正解数
    correctCount = 0;

    // メソッド
    // スタートボタン押下時の処理
    async startQuiz() {
        this.title.textContent = "取得中";
        const message = document.getElementById('message');
        message.textContent = "少々お待ちください";
        start.style.display = 'none';
        start.textContent = '開始'
        // 次のクイズを表示
        this.quizCount = 0; // クイズカウントの初期化
        this.correctCount = 0; //正解カウントの初期化

        // クイズ用のAPIから取得
        try{
            let response = await fetch('https://opentdb.com/api.php?amount=10');
            let data = await response.json(); // 👈 Promiseを返す
            this.quiz = data;
            this.nextQuiz();
        } catch(err) {  // 👈 エラーの場合
            alert(err);
        }
    }   


    // 次のクイズを表示する
    nextQuiz() {
        // クイズエリアの取得
        const selection = document.getElementById('selection');

        // 問題文の表示
        title.textContent = `問題${this.quizCount+1}`;
        category.textContent = `[ジャンル]${this.quiz.results[this.quizCount].category}`;
        difficulty.textContent = `[難易度]${this.quiz.results[this.quizCount].difficulty}`;
        message.innerHTML = this.quiz.results[this.quizCount].question;

        // 正解を取得する
        const correct = this.quiz.results[this.quizCount].correct_answer;
        // 不正解を取得する
        const incorrect = this.quiz.results[this.quizCount].incorrect_answers;

        // 正解と不正解を混ぜる
        let answers = new Array();
        incorrect.forEach(function(e) {
            answers.push(e);
        });
        answers.push(correct);

        // ここでanswersの順番をランダムに変更する
        answers = this.shuffle(answers);

        // 選択肢を作る
        for (let i = 0; i < answers.length; i++) {
            // 選択の一つを作る
            const select = document.createElement("button");
            select.innerHTML = answers[i];
            
            // ボタンのイベントを設定する
            select.addEventListener('click', () => {
                // ボタンのイベントでボタンのテキストと、答えを比較する
                if(select.textContent === correct){
                    // OK なら OKポイントを+1 する、
                    this.correctCount++;
                }
                // quizCountを+1する
                this.quizCount++;
                // selectionの中身をクリア
                selection.innerHTML = '';
                // quizCountが10より小さいなら
                if(this.quizCount < 10){
                    // nextQuizを呼び出す   
                    this.nextQuiz();
                }else{
                    // 違うならresultQuizを呼び出す
                    this.resultQuiz();
                }
            })
            
            selection.appendChild(select);
        }
    }

    // 選択肢をシャッフルする
    shuffle([...array]) {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // クイズ結果を表示する
    resultQuiz() {
        title.textContent = `あなたの正解数は${this.correctCount}です！`;
        message.textContent = '再チャレンジしたい場合は以下をクリック';
        category.textContent = '';
        difficulty.textContent = '';
        restart.style.display = 'block';
    }
    
    // 正答数の画面から最初の画面に遷移する
    restartQuiz() {
        title.textContent = `ようこそ！`;
        message.textContent = '以下のボタンをクリック';
        restart.style.display = 'none';
        start.style.display = 'block';
    }

}

// 画面初期化イベント
window.onload = () => {
    // クイズクラスの初期化
    const quiz = new Quiz();

    // クイズ開始ボタンにクリックイベントの登録
    start.addEventListener('click', () =>{
        // クイズクラスのクイズ開始メソッドを呼び出す
        quiz.startQuiz();
    });
    // ホームに戻るにクリックイベントの登録
    restart.addEventListener('click', () => {
        // クイズクラスのリスタートメソッドを呼び出す
        quiz.restartQuiz();
    })
}
