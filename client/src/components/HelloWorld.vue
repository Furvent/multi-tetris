<template>
  <div class="hello">
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  mounted() {
    console.log("Everything is alright")
    const socket = io("http://localhost:7070")
    console.log("socket", socket)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
