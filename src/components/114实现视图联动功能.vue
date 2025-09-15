
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-03
*/

<template>
    <div class="container">
        <h3>视图联动功能</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers1" ></div>
		<h5>mp1上  -----  mp2下</h5>
		<div id="vue-openlayers2" ></div>
    </div>
</template>
 
<script>
import 'ol/ol.css';
import {Map,View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
 
export default {
  data() {
    return {
        
    };
  },
  mounted() {
 
    var map1= new Map({
      target: "vue-openlayers1",
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        projection: "EPSG:4326",   
        center: [114.064839, 22.548857],  
        zoom: 4
      })
    });
 
   var map2=new Map({
      target: "vue-openlayers2",
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
//主要的代码行关注点
      view:map1.getView()
    });
  }
};
 
</script>
<style scoped>
	.container{
		width: 840px;
		height: 680px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers1,#vue-openlayers2 {
		width: 800px;
		height: 250px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

