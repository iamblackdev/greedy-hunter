<template>

    <div class="game-start">
      

      <!--  -->
      <div>
        
        <!-- GAME HEAGING -->
        <div class="game-heading" :class="{gameHeading: startAnimations}">
          <img src="@/assets/heading-character.png" alt="">
        </div>
        <!-- GAME HEADING ENDS -->

        <!--GAME STSTUS  -->
        <div class="game-status" :class="{animateGameStatus: startAnimations}">
          <div class="game-status-header">
            <h1>{{ status }}</h1>
          </div>
          <div class="game-status-details">
            <p>{{ status2 }}</p>
            <p>{{ status3 }}</p>
          </div>
        </div>
        <!--GAME STATUS ENDS HERE  -->
        
        
        <!--GAME ACTIONS  -->
        <div class="game-action" :class="{animateGameAction: startAnimations}">
          <div class="select-grid">
            <form @submit.prevent="startGame">
              <div class="error" v-if="error">
                Maximum grid = 12 <br> Minimum grid = 5
              </div>
              <div class="input-wrapper">
                Game grid:
                <input type="number" v-model="grid" min="5" max="12" @keyup="checkInput">
                <i class="fa fa-caret-up" @click="increaseGrid"></i>
                <i class="fa fa-caret-down" @click="reduceGrid"></i>
              </div> 
      
              <button class="btn" :disabled="error">Start Game</button>
            </form>
          </div>
        </div>
        <!-- GAME ACTIONS ENDS HERE -->


      </div>

      
  
      
    </div>
  
</template>

<script>
// @ is an alias to /src

export default {
  // RECEIVING PROPS FROM OTHER COMPONENT
  props:['gameStatus', 'timeSpent', 'foodEaten'],

  // DECLEARING VARIABLES
  data() {

    // DEFINING DATA VARIABLES
    return {
      grid: 5, // GRID VALUE
      error: false, // ERROR BLOCK SET TO FALSE
      status: 'Greedy Hunter', // HEADING
      status2: 'The aim is to eat all the food in record time', // TEXT 
      status3: 'Confiure your game grid below 👇🏼', // TEXT
      startAnimations: false // ANIMATIONS VARIABLE
    }
  },
  methods: {

    //  FUNCTION FOR INCREASING INPUT (GRID SELECT)
    increaseGrid(){
      this.grid++
      if (this.grid > 12) {
        this.grid = 12
      }
    },

    //  FUNCTION FOR REDUCING INPUT (GRID SELECT)
    reduceGrid(){
      this.grid--
      if (this.grid < 5) {
        this.grid = 5
      }
    },

    // FUNCTION FOR CHECKING THE MAXIMUN AND MINIMUM VALUE
    checkInput () {
      if (this.grid > 12 || this.grid < 5){
        this.error = true
      }else{
        this.error = false
      }
    }, 

    // FUNCTION FOR STARTING OF GAME
    startGame(){

      // STORE THE NUMBER OF GRID IN LOCALSTORAGE
      localStorage.setItem('storedGrid', this.grid)
      
      //START RUNING OF ANIMATION 
      this.startAnimations = true

      // DELAY ROUTER PUSH FOR ANIMATION TO END
      setTimeout(() => {
        // ROUTER PUSH TO GAMEPLAY SENDING GRID NEEDED AS PROPS
        this.$router.push({name: 'gamePlay', params:{ grid:this.grid}})  
      }, 2100);

    },
  },
  mounted() {

      // CHECKING IF GAME STATUS IS RECEIVED VIA PROPS BEFORE ASSIGNING
      if (this.gameStatus) {
        this.status = this.gameStatus
        this.status2 = this.foodEaten
        this.status3 = this.timeSpent
      }
    },
}

</script>



<style lang="scss">
@import '../scss/config';
@import '../scss/gameStart';



</style>
