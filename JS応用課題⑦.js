// エラーチェックをより厳格化するため
'use strict';

// グローバル変数(shuffle関数でcardsを使用するため)
//カード配列作成
  // constを基本的に使う
    // cardsの配列を作成(最近の開発現場では再代入が必要な場合を除いて、できるだけconstを使いましょう。)
    // 再宣言、再代入のどちらもできないことに加えて、スコープも狭いconstは最も制約が多いからこそ、意図しない実装を防ぐ = 安全なキーワードといえます。
  // letはconstを使えないときに使う
    // 繰り返し行われる処理に対して、合計で何回行ったかカウントを取りたい場合は、letの持つ再代入可能という仕様を活用しましょう。

  // 配列 cardsを作成
  const cards=[];
  // suits(組、組札、同じ組の持ち札)配列を作成
  const suits=['s','d','h','c'];

// 画面が開いた時に実行する関数
window.onload=function(){

  // suitsの配列分回す（４回）
  for(let i=0;i<suits.length;i++){
    // tableの13列を作成
    for(let j=1;j<=13;j++){
      // カードをインスタンス化する(例：suits[0],1 suits[0],2.....)
      let card=new Card(suits[i],j);
      // cardにsetFront関数を実行する
      card.setFront();
      // カード配列の末尾に代入する
      // suits[0]の場合はs suits[1]の場合はd suits[2]の場合はh suits[3]の場合はc
      // それぞれに１〜１３までの数字がある
      cards.push(card);
    }
  }

  // 数字が入った直後にシャッフル関数を実行する
  shuffle();
  //テーブル作成
  create_table();
}




// カードオブジェクト

// コンストラクタ関数を書くことでオブジェクトの種類を定義する（Card）
  function Card(suit,num){
    // suitプロパティ（情報）をもたせます。
    // オブジェクトのプロパティに値を代入するために this を使用
    this.suit=suit;
    // numプロパティを持たせます
    // オブジェクトのプロパティに値を代入するために this を使用
    this.num=num;
    // そのカードが持つfrontを宣言する
    this.front;
    // 関数の機能をsetFrontに代入する
    this.setFront=function(){
      // this.frontに代入する
      // もしthis.numが10より小さい場合は 0 それ以外は何もしない
      //(例) s01 s02 s03... s13
      //(例) d01 d02 d03... d13
      //(例) h01 h02 h03... h13
      //(例) c01 c02 c03... c13
      // .gifは共通とする
      this.front=`${this.suit}${this.num<10?'0':''}${this.num}.gif`;
    };
  }


// カードが並んだテーブルを作成する関数

function create_table() {
  // tableのidを持つ要素を取得する
  const table = document.getElementById('table');
  // suitsの配列分回す（４回）
  for(let i=0;i<suits.length;i++){
    // trの要素を作成
    let tr = document.createElement('tr');
    for(let j=0;j<13;j++){
      // tdの要素を作成
      let td = document.createElement('td');
      // tempCardに代入する
      // i * 0の場合は 0~12 でs行の値がとってこれる
      // i * １の場合は 13~25 でd行の値がとってこれる
      // i * ２の場合は 26~38 でh行の値がとってこれる
      // i * ３の場合は 39~51 でc行の値がとってこれる
      let tempCard=cards[i*13+j];
      // tdにcardクラスを追加する
      td.classList.add('card','back');
      // tdのonclickにflip関数を追加する（関数に（）をつけない）
      td.onclick=flip;

      td.num=tempCard.num;
      // tdにstyleとしてbackgroundImageを追加する(tempCard.frontはそれぞれの画像のURLになる)
      td.style.backgroundImage=`url(images/${tempCard.front})`;
      // trの子要素としてtdを入れる
      tr.appendChild(td);
    }
    // テーブルの子要素にtrを入れてあげる
    table.appendChild(tr);
  }
}

// カードをシャッフルする関数

  // 末尾にある数字をランダムな場所に格納していく
  function shuffle() {
    // cardsの配列の長さをiに代入する
    let i = cards.length;
    // whileはtrueの間実行される（0はfalseとなる）
    while(i) {
      // indexに代入する（1~51の数字がindexに入る,処理後にiが−１される）
      let random_index = Math.floor(Math.random() * i--);
      // 一時的にcardsのランダムに取り出された数字を退避させておく
      let temp_index = cards[random_index];
      // cardsの中でランダムに選ばれた箇所に(51~1の数字を順番に入れていく、-1された後の数字が入るためiは51~1)
      cards[random_index] = cards[i];
      // cardの51~1の数字が順番に代入されるiに退避させておいた数字を入れる
      cards[i] = temp_index;
    }
  }


// カードをクリックした時の関数

  // 一枚のカードの変数
  let firstCard=null;
  // カードを表示するタイマー(カードが2枚ある時に何もしないようにするため)
  let flipTimerId=NaN;

  function flip(e) {
    // イベントの発生源の要素を取得する
    let td = e.target;

    //表のカードをクリックしても何もしない。
    // backのクラスがない場合またはflipTimerIdがtrueの場合
    if(!td.classList.contains('back') || flipTimerId){
      return;
    } else {
      //カードを表にする
      //クラスからbackを取り除く
      td.classList.remove('back')
    }

    //1枚目だったら今めくったカードをfirstCardに設定
    if(firstCard === null) {
      firstCard = td;
    } else {
      //2枚目だったら1枚目と比較して結果を判定する。
      if(firstCard.num === td.num) {
        flipTimerId = setTimeout(function(){
          firstCard.classList.add('finish');
          td.classList.add('finish');
          flipTimerId=NaN;
          firstCard=null;
        },1000)
      } else {
        flipTimerId = setTimeout(function(){
          firstCard.classList.add('back');
          td.classList.add('back');
          flipTimerId=NaN;
          firstCard=null;
        },1000)
      }

    }
  }


