
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-10
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 瓦片地图预加载preload，减少过渡期间的空白区域</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>		
      <div id="map1" class="map-x"></div>
	   <h4 >上面预加载 preload: Infinity，下面默认 preload: 0</h4>
      <div id="map2" class="map-x"></div>
	</div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

export default {
  name: 'PreloadMap',
  data () {
    return {
      map1: null,
      map2: null,
      view: new View({
        projection: "EPSG:4326",
        center: [114, 22],
        zoom: 10
      })
    }
  },
  methods: {
    initMap () {

      this.map1 = new Map({
        target: 'map1',
        layers: [
          new Tile({
            preload: Infinity, // 预加载
            source: new XYZ({
                url:'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                crossOrigin: "anonymous"  
            })
          })
        ],
        view: this.view
      })

      this.map2 = new Map({
        target: 'map2',
        layers: [
          new Tile({
            preload: 0, // 默认值
            source: new XYZ({
                url:'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                crossOrigin: "anonymous"  
            })
          })
        ],
        view: this.view
      })
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 620px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	.map-x {
		width: 800px;
		height: 220px;
		margin: 10px auto;
		border: 1px solid #42B983;
	}
</style>

