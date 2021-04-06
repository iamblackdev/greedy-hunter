<template>
  <div class="game-play">

    <div class="grid-wrapper">
      <h3>You can make use of your arrow keys</h3>
      <div class="grid">

        <!-- GRID HEADER -->
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
        <!-- GRID HEADER ENDS-->

        <!-- GRID BOXES -->
        <div class="grid-boxes" ref="gridBoxes">

          <div v-for="gridbox in gridBoxes" :key="gridbox.id" @click="clickbox(gridbox)" class="box">
            <div v-show="gridbox.characterActive"  :class="{foodscore: gridbox.characterActive}" >{{ gridbox.foodScore }}</div>
            <img v-show="gridbox.foodActive" class="food" src="../assets/food.png" alt="">
            <img v-if="gridbox.characterActive" class="character" src="../assets/character.png" alt="">
          </div>
              
        </div>
        <!-- GRID BOXES ENDS -->

        <!-- GRID BOTTOM -->
        <div class="grid-bottom" >
          <div class="maximum-moves">
            Maximum moves: {{ maxMove }}
          </div>
          <div class="total-moves">
            Total moves: {{ noOfMoves }}
          </div>
        </div>
        <!-- GRID BOTTOM ENDS -->

      </div>

    </div>

  </div>
</template>

<script>
export default {

  // DEFINING DATA VARIABLES
  data() {
    return {
      grid: null, // NO OF GRID SELECTED
      gridBoxes: [], // ARRAY OF GRID BOXES
      noOfBoxes: null, // NUMBER OF BOXES TO BE DIPLAYED
      maxMove: null, // MAXIMUM MOVES
      noOfMoves: 0, // NUMBER OF MOVES
      timeInMilliSeconds: null, // TIME IN MILLI SECONDS
      minutes: 0, // MUNITES OF TIME USED
      seconds: 0, // SECONDS
      randomNumberArray: [], // ARRAY STORING RANDOM NUMBERS (USED FOR MAKING RANDOM FOOD AND CHARACTER ACTIVE)
      characterNumber: 0, // THE ARRAY NUMBER OF THE FIRST ACTIVE CHRACTER 
      foodEaten: 0, // NUMBER OF FOODS EATEN
      health: 0, // HEALTH BAR VALUE
    }
  },
  methods:{

    // FUNCTION FOR STARTIN TIME
    startTime(){
      setInterval(() => {
        this.timeInMilliSeconds += 1000;
        this.millisToMinutesAndSeconds(this.timeInMilliSeconds)
      }, 1000);
    },

    // FUNCTION FOR CONVERTING MILLISECONDS TO TIME
    millisToMinutesAndSeconds(millis) {
      this.minutes = Math.floor(millis / 60000);
      this.seconds = ((millis % 60000) / 1000).toFixed(0);
      if(this.seconds < 10){
        this.seconds = '0' + this.seconds
      }else{
        this.seconds = '' + this.seconds
      }
    },

    // LISTENING FOR CLICK ON EACH BOX
    clickbox(box){
      
      // USING IF STSTEMENT TO CHECK IF CHARACTER CAN MOVE TO THE BOX CLICKED
      if(Math.abs(this.characterNumber - box.id) == 1 || Math.abs(this.characterNumber - box.id) == this.grid){

        // assignment new character number
        this.characterNumber = box.id

        // if box cliked is valid? make move function calls (funcion for chracter movement)
        this.makeMove(box)


        // fuction checks foe game over or game win
        this.gameOverOrWin()
      
      }
    },

    // LISTENING FOR ARROW KEY PRESS
    handleKeydown(e){

      //if key arrow is up
      if (e.key == 'ArrowUp') {

        // checking if character maximum point
        if (!(this.characterNumber <= (this.grid - 1))) {
          
          //getting new chracter position
          this.characterNumber = Math.abs(this.characterNumber - this.grid)

          // function for activating food
          this.foodActiveFunction(this.characterNumber)

          // key press move function for food and character
          this.keyPressMoveFunction(this.characterNumber)
          
        }

        this.gameOverOrWin()

      //if key arrow is down
      }else if (e.key == 'ArrowDown') {        

        // checking if character maximum point
        if (!(this.characterNumber <= (this.noOfBoxes - 1) && (this.characterNumber > this.noOfBoxes - (this.grid - 1)))) {

          //getting new chracter position
          this.characterNumber += parseInt(this.grid)

          // function for activating food
          this.foodActiveFunction(this.characterNumber)

          // key press move function for food and character
          this.keyPressMoveFunction(this.characterNumber)
        }

        this.gameOverOrWin()


      //if key arrow is left
      }else if (e.key == 'ArrowLeft') {

          // getting the id of all left boxes
          let firstBoxesOnLeft = []
          for (let i = 0; i < this.noOfBoxes; i += parseInt(this.grid) ) {
            firstBoxesOnLeft.push(i);    
          }

          // checking if character maximum point
          if (!(firstBoxesOnLeft.includes(this.characterNumber))) {

            //getting new chracter position
            this.characterNumber = this.characterNumber - 1

            // function for activating food
            this.foodActiveFunction(this.characterNumber)

            // key press move function for food and character
            this.keyPressMoveFunction(this.characterNumber)
            
          }

          this.gameOverOrWin()

          
      //if key arrow is right
      }else if (e.key == 'ArrowRight') {

        // getting the id of all right boxes
        let lastBoxesOnRight = []
          for (let i = (this.grid - 1); i < this.noOfBoxes; i += parseInt(this.grid) ) {
            lastBoxesOnRight.push(i);    
          }

           // checking if character maximum point  
          if (!(lastBoxesOnRight.includes(this.characterNumber))) {
           
            //getting new chracter position
            this.characterNumber = this.characterNumber + 1

            // function for activating food
            this.foodActiveFunction(this.characterNumber)

            // key press move function for food and character
            this.keyPressMoveFunction(this.characterNumber)
          }

          this.gameOverOrWin()


      }
    },

    // FUNCTION RESPONSIBLE FOR CHARACTER MOVEMENT
    makeMove(box){

      // if food is active in box clicked
      if (box.foodActive) {
          // the food is turned back to false
          box.foodActive = false

          // food eaten is counted
          this.foodEaten++

          // the health bar is increased by thre food score
          this.health +=  parseInt(box.foodScore.substring(1))
          this.$refs.barStatus.style.width = `${this.health}%`

          // turns clicked food score to null
          setTimeout(() => {
            box.foodScore = null
          }, 300);

        }
          // chracter is turned false in all boxes
          this.gridBoxes.forEach(e => {
            e.characterActive = false
          })

          // character if turnbed back to true in the clicked box
          box.characterActive = true

          // number of moves is incremented
          this.noOfMoves++
    },

    // FUNCTION FOR ACTIVATEIN DIFFERENT FOODS
    foodActiveFunction(characterNumber){

      if (this.gridBoxes[characterNumber].foodActive) {
        this.gridBoxes[characterNumber].foodActive = false
        this.foodEaten++
        this.health +=  parseInt(this.gridBoxes[characterNumber].foodScore.substring(1))
        this.$refs.barStatus.style.width = `${this.health}%`
        setTimeout(() => {
          this.gridBoxes[characterNumber].foodScore = null
        }, 150);
      }
    },

    keyPressMoveFunction(characterNumber){
      this.noOfMoves++
      this.gridBoxes.forEach(e => {
      e.characterActive = false
      })
      this.gridBoxes[characterNumber].characterActive = true  
    },

    // FUNCTION CALL EITHER GAME OVER OR WIN AFTER CHECKING THE CONDITION
    gameOverOrWin(){
      // checking if number of moves is equal to maximum movement and food eaten is less than the total food
        if (this.noOfMoves == this.maxMove && this.foodEaten < this.grid) {

          // call the game over function
          this.gameOver()

        }

        // checks if all food are eaten
        if (this.foodEaten == this.grid) {
          // call the barvo function
          this.bravo()

        }
    },

    // FUNTION CALLED WHEN GAME OVER CONDITION IS MET
    gameOver(){

        // push router new routes and send different data as props
        this.$router.push({name: 'gameStart', params: {
            gameStatus: 'Game Over', // sending gameover text as props
            foodEaten: `Total Food: ${this.foodEaten} / ${this.grid}`, // sending total food eaten
            timeSpent: `Time Spent: ${this.minutes}:${this.seconds} ` // sending total time spent as props
          }
        })
        // clear the grid value stored in the local storage
        localStorage.removeItem('storedGrid')

        //remove event listen keyup from windows
        window.removeEventListener('keyup', this.handleKeydown);
    },

    // FUNCTION CALLED WHEN GAME IS WON
    bravo(){
        // takes a little time to complete foodscore animation
        setTimeout(() => {

          // pushing new routes and send different data as props
          this.$router.push({name: 'gameStart', params: {
            gameStatus: 'Bravo', // sending bravo text as props
            foodEaten: '', // food eaten not need, so sent an empty string
            timeSpent: `Time Spent: ${this.minutes}:${this.seconds}` // sending total time pent as props
            }
          })
        }, 600);

        // clear grid stored in local storage
        localStorage.removeItem('storedGrid')

        //remove event listen keyup from windows
        window.removeEventListener('keyup', this.handleKeydown);
    },
  },

  created() {
  	window.addEventListener('keyup', this.handleKeydown);
  },

  // MOUNTED FUNCTION RUNS A OUR PAGE IS BEEN MOUNTED
  mounted(){

    // retriving grid data from local storage
    this.grid = localStorage.getItem('storedGrid');


    // setting up grid template for the boxes
    this.$refs.gridBoxes.style.gridTemplateColumns = `repeat(${this.grid}, 1fr)`
    this.$refs.gridBoxes.style.gridTemplateRows = `repeat(${this.grid}, 1fr)`

    // getting to tal number of grid boxes needed
    this.noOfBoxes = this.grid * this.grid

    // getting maximum number of moves
    this.maxMove = Math.round(this.noOfBoxes / 2)

    // creating an array (gridBoxes) to hold objects containing different data for the boxes
    for (let i = 0; i < this.noOfBoxes; i++){
      // asiging value to each oject
      this.gridBoxes.push({
        id: i, // id number
        foodActive: false, // food active
        characterActive: false, // character active
        foodScore: null // food score

      })
    }


    // CREATING SCORES FOR ACTIVE FOOD

    //varibles
      let max = 100; // maximum number of score
      let scores = []; // use for storing each scores
      let count = this.grid // used in the loop for counting
      let diffOfArray = 0 // storing difference of the array
      for (let i = 1; i < this.grid; i++) {

        // storing different scores in the array
        scores[i] = randombetween(1, max-(count--)+diffOfArray)

        // getting difference of the array
        diffOfArray = scores.reduce((total, diff) => total - diff,0)  
      }
      // asiging the first score of the array
      scores[0] = max + diffOfArray

      // function called when assigning scores to the array
      function randombetween(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
      }


    // MAKE RANDOM FOOD ACTIVE
    let loopcount = this.grid // used for food active loop coounting
    for (let i = 1; i <= loopcount; i++) {

      // getting random number
        let randomNumber = Math.floor(Math.random() * this.noOfBoxes)

        // checking if random number is already included in the array
        if (this.randomNumberArray.includes(randomNumber)) {
          // if included increase loop count
          loopcount++
        }else{
          // is not puh the new number into the array
          this.randomNumberArray.push(randomNumber)

          // also make food active using the number just gotten
          this.gridBoxes[randomNumber].foodActive = true
        }
      }

    //ATTACHING SCORES TO EACH FOOD
    for (let i = 0; i < scores.length; i++) {
      
      // since the numbers from the random number array are used in making random food active
      // also used them in assiging scores using scores in the scores array
      this.gridBoxes[this.randomNumberArray[i]].foodScore =  `+${scores[i]}`
    }


    // MAKE CHARACTER ACTIVE
    let characterLoop= 1 // used for character loop counting
    for (let i  = 1; i <= characterLoop; i++) {

        // getting character number (for making character active)
        this.characterNumber = Math.floor(Math.random() * this.noOfBoxes)

        // since we dont want a charcter and food be active in same box
        //we use the random array number used in making different food active to make the character active
        // if number is already included
      if (this.randomNumberArray.includes(this.characterNumber)) {
        // increment loop counter 
        characterLoop++
      }else{

        //storing chracter number in random number array
        this.randomNumberArray.push(this.characterNumber)

        // make the character active
        this.gridBoxes[this.characterNumber].characterActive = true
      }
    }

  	// window.addEventListener('keyup', this.handleKeydown);

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
    .grid-wrapper h3{
      display: none;
      text-align: center;
      margin-bottom: 10px;
    }
    // GRID STYLES 
    .grid{
      padding: 30px 10px;
      background-color: white;
      border-radius: 17.5186px;
      height: 100%;
      max-width: 706px;
      margin: 0 auto;
      position: relative;
      animation: grid-animations .5s ease 0s 1 normal forwards;

      // GRID-HEADER STYLES 
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

      // GRID BOXEX STYLES 
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

         .foodscore{
            position: absolute;
            top: 74px;
            animation-name: food-score-animate;
            animation-duration: .3s;
            animation-timing-function: ease-out;
          }
          .food{
            width: 80%;
            transform: scale(0);
            animation: grid-animations .5s ease .6s 1 normal forwards; 
          }
          .character{
            width: 80%;
          }
        }
      }

      // GRID BOTTOM STYES
      &-bottom{
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
      }

    }
  }

  // GRID ANIMATION
  @keyframes grid-animations {
  0%{ transform: scale(0); opacity: 0;}
  10%{ transform: scale(.1); opacity: .1;}
  20%{ transform: scale(.2);  opacity: .2;}
  30%{ transform: scale(.3); opacity: .3;}
  40%{ transform: scale(.4); opacity: .4;}
  50%{ transform: scale(.5); opacity: .5;}
  60%{ transform: scale(.6); opacity: .6;}
  70%{ transform: scale(.7); opacity: .7;}
  80%{ transform: scale(.8); opacity: .8;}
  90%{ transform: scale(.9); opacity: .9;}
  100%{ transform: scale(1); opacity: 1;}
  }

  // FOOD ANIMATIONS
  @keyframes food-score-animate {
    from{right: 12%; opacity: 0;}
    50%{right: 15%; opacity: 1;}
    to{right: 18%; opacity: 0;}
  }
  @media (min-width: 380px) {
    .game-play{
      .grid{
        &-boxes{
          .box{
            .food{
              width: 60%;
            }
            .character{
              width: 60%; 
            }
          }
        }
      }
    }
    @keyframes food-score-animate {
      from{right: 18%;}
      50%{right: 21%;}
      to{right: 24%;}
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
            .character{
              width: 40%;
            }
          }
        }
      }
    }
    @keyframes food-score-animate {
      from{right: 24%;}
      50%{right: 27%;}
      to{right: 30%;}
    }
  }
  @media (min-width: 680px) { 
    .game-play{
      .grid{
        &-boxes{
          .box{
            .foodscore{
              right: 30%;
            } 
            .food{
              width: 30%;
            }
            .character{
              width: 30%;
            }
          }
        }
      }
    }
    @keyframes food-score-animate {
      from{right: 30%;}
      50%{right: 33%;}
      to{right: 36%;}
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
            font-size: 18px;
            order: 1;
            width: 20%;
          }
          .game-health{
            width: 40%;
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
              color: #853594;
              top: 28px;
            }
          }
        }
      }
    }
    @keyframes food-score-animate {
      from{right: 35%;}
      50%{right: 38%;}
      to{right: 41%;}
    }
  }
  @media (min-width: 992px) { 
     .game-play{
       padding: 80px 20px;
       .grid-wrapper h3{
         display: block;
       }
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