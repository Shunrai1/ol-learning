/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-07
*/

<template>
    <div class="container">
        <h3>vue+openlayers：加载谷歌地图（另一种URL方式）</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers" ></div>
    </div>
</template>
 
<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import XYZ from "ol/source/XYZ";
	import TileLayer from 'ol/layer/Tile' 
export default {
  data() {
    return {
        map:null,
    };
  },
  
  methods:{
// 初始化地图	 
	 initMap(){		 

			 let googleLayer=new TileLayer({   //Google图层
			               source: new XYZ({
			           url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
			           }),
			           zIndex:2
			 });
		 
	 		this.map= new Map({
	 		        target: "vue-openlayers",
	 		        layers: [
                        googleLayer,
	 		        ],
					view: new View({
						projection: "EPSG:4326",
						center: [116.389,39.903],
						zoom: 8
					}),
	 		      })

	 		},
		
  },  
  mounted() {
            this.initMap()
		  }
	  }

</script>
<style scoped>
	.container{
		width: 840px;
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 800px;
		height: 450px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

