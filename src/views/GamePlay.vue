<template>
  <div class="game-play">

    <div class="grid">

      <div class="grid-header">

        <div class="game-grid-info">
          Grid {{ grid }} x {{ grid }}
        </div>

        <div class="game-health">

          <div class="health-wrapper" @click="generate()">
            <img class="heart" src="../assets/heart.png" alt="">
            <div class="progressBar">
              <div class="barStatus" ref="barStatus"></div>
            </div>
          </div>

        </div>

        <div class="game-time">
          <span class="time-text">Time Spent: </span> {{ minutes }}:{{ seconds }} secs
        </div>

      </div>

      <div class="grid-boxes" ref="gridBoxes">

        <div v-for="gridbox in gridBoxes" :key="gridbox.id" @click="clickbox(gridbox)" class="box">
          <div class="foodscore" v-show="gridbox.characterActive" :class="{foodscoreAnimate: gridbox.characterActive}" >{{ gridbox.foodScore }}</div>
          <img v-if="gridbox.foodActive" class="food" src="../assets/food.png" alt="">
          <img v-if="gridbox.characterActive" class="food" src="../assets/character.png" alt="">
        </div>
             
      </div>

      <div class="grid-bottom" >
        <div class="maximum-moves">
          Maximum moves: {{ maxMove }}
        </div>
        <div class="total-moves">
          Total moves: {{ noOfMoves }}
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {

  data() {
    return {
      grid: null,
      gridBoxes: [],
      noOfBoxes: null,
      maxMove: null,
      timer: null,
      reactionTime: null,
      minutes: 0,
      seconds: 0,
      randomNumberArray: [],
      characterNumber: 0,
      noOfMoves: 0,
      foodEaten: 0,
      health: 0,
    }
  },
  methods:{
    startTime(){
      this.timer = setInterval(() => {
        this.reactionTime += 1000;
        this.millisToMinutesAndSeconds(this.reactionTime)
      }, 1000);
    },
    millisToMinutesAndSeconds(millis) {
      this.minutes = Math.floor(millis / 60000);
      this.seconds = ((millis % 60000) / 1000).toFixed(0);
      if(this.seconds < 10){
        this.seconds = '0' + this.seconds
      }else{
        this.seconds = '' + this.seconds
      }
    },
    clickbox(box){

      if(Math.abs(this.characterNumber - box.id) == 1 || Math.abs(this.characterNumber - box.id) == this.grid){
        this.characterNumber = box.id
        this.makeMove(box)

        if (this.noOfMoves > this.maxMove) {
          this.gameOver()
        }
        if (this.foodEaten == this.grid) {
          this.bravo()
        }
      }
    },
    makeMove(box){
      if (box.foodActive) {
          box.foodActive = false
          this.gridBoxes.forEach(e => {
            e.characterActive = false
          })
          box.characterActive = true
          this.noOfMoves++
          this.foodEaten++
          this.health += box.foodScore
          this.$refs.barStatus.style.width = `${this.health}%`
          
          setTimeout(() => {
            box.foodScore = null
          }, 700);

        }else{
          this.gridBoxes.forEach(e => {
            e.characterActive = false
          })
          box.characterActive = true
          this.noOfMoves++
      }
    },
    gameOver(){
        this.$router.push({name: 'gameStart', params: {
          gameStatus: 'Game Over',
          foodEaten: `Total Food: ${this.foodEaten} / ${this.grid}`,
          timeSpent: `Time Spent: ${this.minutes}:${this.seconds} `
        }
      })
    },
    bravo(){
        setTimeout(() => {
          this.$router.push({name: 'gameStart', params: {
            gameStatus: 'Bravo',
            foodEaten: '',
            timeSpent: `Time Spent: ${this.minutes}:${this.seconds} `
            }
          })
        }, 600);
    },
  },
  mounted(){
    // RETRIVING DATA FROM LOCAL STORAGE
    this.grid = localStorage.getItem('storedGrid');
    // console.log(this.$refs.gridBoxes.style)

    // SETTING THE GRID TEMPLATE
    this.$refs.gridBoxes.style.gridTemplateColumns = `repeat(${this.grid}, 1fr)`
    this.$refs.gridBoxes.style.gridTemplateRows = `repeat(${this.grid}, 1fr)`

    // GETTING TOTAL NUMBER OF GRID BOXES
    this.noOfBoxes = this.grid * this.grid

    //GETTING MAXIMUM NUMBER OF MOVES
    this.maxMove = Math.round(this.noOfBoxes / 2)

    // CREATING AN ARRAY EQUAL TO THE TOTAL NUMBER OF BOXES
    for (let i = 0; i < this.noOfBoxes; i++){
      this.gridBoxes.push({
        id: i,
        foodActive: false,
        characterActive: false,
        foodScore: null

      })
    }


    // CREATING SCORES FOR ACTIVE FOOD
      let max = 100;
      let scores = [];
      let count = this.grid
      let diffOfArray = 0
      for (let i = 1; i < this.grid; i++) {
        scores[i] = randombetween(1, max-(count--)+diffOfArray)
        diffOfArray = scores.reduce((total, diff) => total - diff,0)  
      }
      scores[0] = max + diffOfArray

      function randombetween(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
      }


    // MAKE RANDOM FOOD ACTIVE
    let newgridNumber = this.grid

    for (let i = 1; i <= newgridNumber; i++) {
      let randomNumber = Math.floor(Math.random() * this.noOfBoxes)
      if (this.randomNumberArray.includes(randomNumber)) {
        newgridNumber++
      }else{
        this.randomNumberArray.push(randomNumber)
        this.gridBoxes[randomNumber].foodActive = true
      }
    }

    //ATTACHING SCORES TO EACH FOOD
    for (let i = 0; i < scores.length; i++) {
      this.gridBoxes[this.randomNumberArray[i]].foodScore = scores[i]
    }


    // MAKE CHARACTER ACTIVE
    let characterLoop= 1
    for (let i  = 1; i <= characterLoop; i++) {
        this.characterNumber = Math.floor(Math.random() * this.noOfBoxes)
      if (this.randomNumberArray.includes(this.characterNumber)) {
        characterLoop++
      }else{
        this.randomNumberArray.push(this.characterNumber)
        this.gridBoxes[this.characterNumber].characterActive = true
      }
    }

    // START TIME
    this.startTime()

  }
}
</script>


<style lang="scss">
  .game-play{
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    width: 100%;
    height: 100vh;
    background-image: url(../assets/game-play-background.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: #23144B;
    padding: 50px 20px;

    .grid{
      padding: 30px 10px;
      background-color: white;
      border-radius: 17.5186px;
      height: 100%;
      max-width: 706px;
      margin: 0 auto;
      
      &-header{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;


        .game-grid-info{
        width: 50%;
        font-size: 14px;
        line-height: 18px;
        order: 1;
      }

      .game-health{
        position: relative;
        width: 100%;  
        margin: 10px 0;
        order: 3;
        display: flex;
        justify-content: center;

        .health-wrapper{
          display: flex;
          align-items: center;
        }
        .heart{
          text-align: center;
          transform: scale(.7);
          margin-left: 24px;
          z-index: 1;
        }
        .progressBar {
          position: relative;
          left: -24px;
          width: 100px;
          height: 18.04px;
          background: linear-gradient(180deg, #853594 47.39%, #692789 47.4%);
          border: 2.15507px solid #532461;
          border-radius: 12.661px;
        }
        .barStatus {
          position: absolute;
          top: -1px;
          width: 0%;
          height: 15.77px;
          background: linear-gradient(180deg, #F07CC3 44.27%, #C5418E 44.28%);
          border: 1.87639px solid #FFFFFD;
          border-radius: 11.0238px;
          transition: width 0.9s ease;   
        }

      }
      .game-time{
        width: 50%;
        order: 2;
        text-align: right;

        .time-text{
          display: none;
        }
      }

      }

      &-boxes{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        height: 70%;
        border: 4px solid #853594;
        grid-gap: 1px;
        box-sizing: border-box;
        .box{
          box-shadow:0 0 0 1px #853594;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .foodscore{
            display: none;
          }
          .food{
            width: 80%;
          }
        }
      }

      &-bottom{
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
      }

    }
  }
  @media (min-width: 380px) { 
    .game-play{
      .grid{
        &-boxes{
          .box{
            .food{
              width: 60%;
            }
          }
        }
      }
    }
  }
  @media (min-width: 480px) { 
    .game-play{
      .grid{
        &-boxes{
          .box{
            .food{
              width: 40%;
            }
          }
        }
      }
    }
  }
  @media (min-width: 680px) { 
    .game-play{
      .grid{
        &-boxes{
          .box{
            .food{
              width: 30%;
            }
          }
        }
      }
    }
  }
  @media (min-width: 768px) { 
    .game-play{
      font-size: 18px;

      .grid{
        height: 100%;
        padding: 30px;
        &-header{
          
          .game-grid-info{
            order: 1;
            width: 30%;
          }
          .game-health{
            width: 30%;
            order: 2;
            margin-top: 0px;
            top: -15px;
            
            .heart{
              transform: scale(1);
            }
          }
          .game-time{
            width: 30%;
            order: 3;
            .time-text{
              display: inline-block;
            }
          }
        }
        &-boxes{
          .box{
            .foodscore{
              display: block;
              font-size: 13px;
              color: #853594;
              position: absolute;
              right: 3px; 
            }
            .foodscore.foodscoreAnimate{
               top: 8px;
               opacity: 0;
              animation-name: foodanimate;
              animation-duration: .7s;
              animation-timing-function: ease-out;
            }
          }
        }

      }
    }
  }

  @keyframes foodanimate {
    from{top: 20px; opacity: 0;}
    50%{top: 13px; opacity: 1;}
    to{top: 8px; opacity: 0;}
  }
  @media (min-width: 992px) { 
     .game-play{
       .grid{
         height: 100%;
       }
     }
  }
  @media (min-width: 1200px) { 
      .game-play{
        .grid{
          height: 90%;
        }
      }
  }

</style>