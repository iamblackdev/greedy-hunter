<template>
  <div class="game-play">

    <div class="grid-wrapper">

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
      <h3>You can make use of your arrow keys</h3>
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
            timeSpent: `Time Spent: ${this.minutes}:${this.seconds}`, // sending total time spent as props
            buttonText: 'Start again'
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
            timeSpent: `Time Spent: ${this.minutes}:${this.seconds}`, // sending total time spent as props
            buttonText: 'Start again'
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
@import '../scss/gamePlay';
  

</style>