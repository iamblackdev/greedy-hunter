<template>

    <div class="game-start">
      <!--  -->
      <div class="game-heding">
        <img src="@/assets/heading-character.png" alt="">
      </div>

      <!--  -->
      <div class="game-status">
        <div class="game-status-header">
          <h1>{{ status }}</h1>
        </div>
        <div class="game-status-details">
          <p>{{ status2 }}</p>
          <p>{{ status3 }}</p>
        </div>
      </div>
  
      <!--  -->
      <div class="game-action">
        <div class="select-grid">
          <form @submit.prevent="startGame">
            <div class="error" v-if="error">
              Maximum grid = 12 <br> Minimum grid = 5
            </div>
            Game grid: 
            <input type="number" v-model="grid" min="5" max="12" @keyup="checkInput">

            <div><button class="btn" :disabled="error">Start Game</button></div>
          </form>
        </div>
      </div>
    </div>
  
</template>

<script>
// @ is an alias to /src

export default {
  props:['gameStatus', 'timeSpent', 'foodEaten'],
  data() {
    return {
      grid: 5,
      error: false,
      status: 'Greedy Hunter',
      status2: 'The aim is to eat all the food in record time',
      status3: 'Confiure your game grid below 👇🏼'
    }
  },
  methods: {
    checkInput () {
      if (this.grid > 12 || this.grid < 5){
        this.error = true
      }else{
        this.error = false
      }
    }, 
    startGame(){

      // STORE THE NUMBER OF GRID IN LOCALSTORAGE
      localStorage.setItem('storedGrid', this.grid)

      // ROUTER PUSH TO GAMEPLAY
      this.$router.push({name: 'gamePlay', params:{ grid:this.grid}})
    },
  },
  mounted() {
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

.game-start{
  font-family: 'Inter', sans-serif;
  width: 100%;
  height: 100vh;
  text-align: center;
  padding-top: 10px;
  background-color: $primary-color;
  // transform: scale(.7);
  .game-status{
    margin: 20px 0;
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

  .game-action{
    color: #EE8D94;

    .error{
      font-size: 13px;
      color: red;
      margin-bottom: 7px;
    }

    input{
      margin-left: 20px;
      height: 37px;
      width: 100px;
      background-color: transparent;
      padding: 10px;
      color: white;
      border: 4px solid #EE8D94;
      box-sizing: border-box;
      border-radius: 5px;
    }
    .btn{
      margin-top: 40px;
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

/* Chrome, Safari, Edge, Opera */
</style>
