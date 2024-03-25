<template>
  <div>
    <div class="images flex" v-viewer="{movable: false}">
      <img class="hidden h-20 w-20 " v-for="src in images" :src="src" :key="src">
    </div>
    
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import 'viewerjs/dist/viewer.css'
  import { directive as viewer } from "v-viewer"
  export default defineComponent({
    directives: {
      viewer: viewer({
        debug: false,
      }),
    },
    watch:{
      preview(){
        this.show();
      }
    },
    props:['images','preview'],
    methods: {
      show () {
        const viewer = this.$el.querySelector('.images').$viewer
        viewer.show()
      }
    }
  })
</script>

<style  >

.viewer-title{
  display: none;
}
.viewer-canvas{
  background-color: black;
}
.viewer-list{
  width: 100% !important;
  height: 100% !important;
}
.viewer-navbar{
  width: 100%;
}
.viewer-list>li{
    width: 60px !important;
    height: 60px !important;
}


@media (min-width: 1600px) {
  .viewer-list{
  width: 100% !important;
  height: 100% !important;
}
.viewer-list>li{
    width: 300px !important;
    height: 300px !important;
}
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .viewer-list{
  width: 100% !important;
  height: 100% !important;
}
.viewer-list>li{
    width: 200px !important;
    height: 200px !important;
}
}
</style>