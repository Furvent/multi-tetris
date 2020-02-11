<template>
    <div>
        Tetris!
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';

export default Vue.extend({
    mounted() {
    const socket = io("http://localhost:7070")
    console.log("socket", socket)
  }
})
</script>