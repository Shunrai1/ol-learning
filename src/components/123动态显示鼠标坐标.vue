/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-02
*/
<template>
    <div class="container">
        <h3>vue+openlayers：显示鼠标在地图上的坐标信息</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers" class="map-x">
		   <div class="mouse" ref="mousePositionTxt"></div>
		</div>
    </div>
</template>
<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import { OSM } from 'ol/source'
import * as control from 'ol/control'
import * as coordinate from 'ol/coordinate';
export default {
  name: 'ZoomToExtent',
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target: 'vue-openlayers',
        controls: control.defaults().extend([
                    new control.MousePosition({
                      coordinateFormat: coordinate.createStringXY(4),
                      projection: 'EPSG:4326',
                      target: this.$refs.mousePositionTxt
                    })
        ]),
        layers: [
          new Tile({
			source: new OSM()  
          })
        ],
        view: new View({
          projection: "EPSG:4326", 
          center: [114.064839, 22.548857],
          zoom: 4 
        })
      })
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
		height: 520px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
	.mouse{ position: absolute; bottom:50px; right: 20px;z-index: 10; color: #f00; width: 150px;}
</style>


