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

// GAME START STYLES
.game-start{
  font-family: 'Inter', sans-serif;
  width: 100%;
  height: 100vh;
  text-align: center;
  padding-top: 10px;
  background-color: $primary-color;

//GAME HEADING STYLES 
  .game-heading{
    position: relative;
    transform: scale(0);
    animation: animate-in .7s ease 0s 1 reverse forwards; 
  }
  .game-heading.gameHeading{
    position: relative;
    transform: scale(1);
    animation: animate-out .7s ease 0s 1 normal forwards;
  }

// GAME STATUS STYLES
  .game-status{
    margin: 20px 0;
    transform: scale(0);
    animation: animate-in .7s ease .7s 1 reverse forwards;
    &-header{
      color: $secondary-color;
      font-style: normal;
      font-weight: 600;
      line-height: 77px;
    }
    &-details{
      margin-top: 13px;
      p{
        margin-top: 10px;
      }
    }
  }
  .game-status.animateGameStatus{
    position: relative;
    transform: scale(1);
    animation: animate-out .7s ease .7s 1 normal forwards;
  }

// GAME ACTIONS STYLES
  .game-action{
    color: #EE8D94;
    position: relative;
    transform: scale(0);
    animation: animate-in .7s ease 1.4s 1 reverse forwards;


    .error{
      font-size: 13px;
      color: red;
      margin-bottom: 7px;
    }
    .input-wrapper{
      position: relative;
      .fa{
        display: none;
      }
      input{
        margin-left: 20px;
        height: 37px;
        width: 40px;
        background-color: transparent;
        padding: 10px;
        color: white;
        border: 4px solid #EE8D94;
        box-sizing: border-box;
        border-radius: 5px;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        display: none;
        -webkit-appearance: none;
      }
    }
    .btn{
      margin-top: 30px;
      padding: 20px 50px;
      background-color: #853594;
      color: $light-color;
      border: 1px solid #853494;
      border-radius: 10px;
      cursor: pointer;
    }
    .btn:disabled{
      cursor: auto;
      opacity: 0.5;

    }
  }
  .game-action.animateGameAction{
    position: relative;
    transform: scale(1);
    animation: animate-out .7s ease 1.4s 1 normal forwards;
  }
}

// ANIMATIONS FOR ELEMENTS COMING IN
@keyframes animate-in {
  0%{ transform: scale(1); opacity: 1;}
  10%{ transform: scale(1.1); opacity: 1;}
  20%{ transform: scale(1.2); top: 0px; opacity: 1;}
  30%{ transform: scale(1.1); top: 0px; opacity: 1;}
  40%{ transform: scale(1); top: 5px; opacity: 1;}
  50%{ transform: scale(.9); top: 10px; opacity: .9;}
  60%{ transform: scale(.7); top: 15px; opacity: .7;}
  70%{ transform: scale(.5); top: 20px; opacity: .5;}
  80%{ transform: scale(.3); top: 25px; opacity: .3;}
  90%{ transform: scale(.2); top: 30px; opacity: .2;}
  100%{ transform: scale(.1); top: 35px; opacity: 0;}
}
// ANIMATIONS FOR ELEMENTS GOIN OUT
@keyframes animate-out {
  0%{ transform: scale(1); opacity: 1;}
  10%{ transform: scale(1.1); opacity: 1;}
  20%{ transform: scale(1.2); top: 0px; opacity: 1;}
  30%{ transform: scale(1.1); top: 0px; opacity: 1;}
  40%{ transform: scale(1); top: 5px; opacity: 1;}
  50%{ transform: scale(.9); top: 10px; opacity: .9;}
  60%{ transform: scale(.7); top: 15px; opacity: .7;}
  70%{ transform: scale(.5); top: 20px; opacity: .5;}
  80%{ transform: scale(.3); top: 25px; opacity: .3;}
  90%{ transform: scale(.2); top: 30px; opacity: .2;}
  100%{ transform: scale(.1); top: 35px; opacity: 0;}
}

@media (min-width: 768px) { 
  .game-start{
    padding-top: 30px;
    &::before{
      content: '';
      background-image: url(../assets/dots.png);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      height: 90%;
      width: 23%;
      position: absolute;
      top: 30px;
      left: 20px;
    }
    &::after{
      content: '';
      background-image: url(../assets/dots.png);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      height: 90%;
      width: 23%;
      position: absolute;
      top: 30px;
      right: 20px;
    }
  }


 }
 @media (min-width: 992px) {
   .game-start{
     .game-action{
       .input-wrapper{
        .fa{
          display: inline-block;
        }
        .fa-caret-up{
          position: relative;
          right: 27px;
          top: -3px;
          font-size: 25px;
          cursor: pointer;
        }
        .fa-caret-down{
          position: relative;
          top: 10px;
          right: 41px;
          font-size: 25px;
          cursor: pointer;
        }
        input{
          width: 100px;
        }
      }
     }
   }
 }
@media (min-width: 1200px) { 
  body{
    font-size: 20px;
  }
  .game-start{
    padding-top: 30px;
    &::before{
      width: 30%;
      left: 40px;
    }
    &::after{ 
      width: 30%;
      right: 40px;
    }

    .game-status{
      &-header{
        font-size: 24px;
      }
    }
    .game-action{
      margin-top: 50px;

      
      .btn{
        padding: 20px 80px;
        font-size: 20px;
      }
    }
  }
}

</style>
