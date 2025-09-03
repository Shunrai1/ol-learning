/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-08
*/
<template>
    <div class="container">
        <h3>vue+openlayers: 控制旋转地图视图</h3>
        <p>CDSN作者：还是大剑师兰特</p>
		<h4>
			<el-button @click="rotateLeft">↻</el-button>
			<el-button @click="rotateRight">↺</el-button>
		</h4>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

export default {
  name: 'RotationMap',
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target: 'vue-openlayers',
        layers: [
          new Tile({
            source: new OSM()
          })
        ],
        view: new View({
          projection: "EPSG:4326", 
          center: [116.064839, 39.548857], 
          rotation: 0,
          zoom: 8 
        })
      })
    },
    rotateLeft () {
      let currentRotation = this.map.getView().getRotation()
      this.map.getView().setRotation(currentRotation + 1)
    },
    rotateRight () {
      let currentRotation = this.map.getView().getRotation()
      this.map.getView().setRotation(currentRotation - 1)
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style scoped>
    .container{
        width: 840px;
        height: 590px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>



