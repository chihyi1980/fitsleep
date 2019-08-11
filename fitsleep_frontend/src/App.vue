<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import router from './router'
export default {
  name: 'Fit-Sleep',
  created () {
    if (router.currentRoute.name !== 'SignIn' && !window.localStorage.getItem('isToken')) {
      router.push({ name: 'SignIn' })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
}
</style>
