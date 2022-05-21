function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    }
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: 0 }
      } else {
        return { width: this.monsterHealth + '%' }
      }
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: 0 }
      } else {
        return { width: this.playerHealth + '%' }
      }
    },
    mayUseSpecial() {
      return this.currentRound % 3 !== 0
    },
    mayUseHeal() {
      return this.currentRound % 2 !== 0
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // draw
        this.winner = 'draw'
      } else if (value <= 0) {
        // Player lost
        this.winner = 'monster'
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // draw
        this.winner = 'draw'
      } else if (value <= 0) {
        // Monster lost
        this.winner = 'player'
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++
      const damageValue = getRandomValue(5, 12)
      this.monsterHealth -= damageValue
      this.addLogMessage('player', 'attack', damageValue)
      this.attackPlayer()
    },
    attackPlayer() {
      const damageValue = getRandomValue(8, 15)
      this.playerHealth -= damageValue
      this.addLogMessage('monster', 'attack', damageValue)
    },
    specialAttack() {
      this.currentRound++
      const damageValue = getRandomValue(10, 25)
      this.monsterHealth -= damageValue
      this.addLogMessage('player', 'attack', damageValue)
      this.attackPlayer()
    },
    healPlayer() {
      this.currentRound++
      const healValue = getRandomValue(8, 20)
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100
      } else {
        this.playerHealth += healValue
      }
      this.addLogMessage('player', 'heal', healValue)
      this.attackPlayer()
    },
    startGame() {
      this.currentRound = 0
      this.playerHealth = 100
      this.monsterHealth = 100
      this.winner = null
      this.logMessages = []
    },
    surrender() {
      this.winner = 'monster'
    },
    addLogMessage(who, what, value) {
      const message = {
        actionBy: who,
        actionType: what,
        actionValue: value,
      }
      this.logMessages.unshift(message)
    },
  },
})

app.mount('#game')
