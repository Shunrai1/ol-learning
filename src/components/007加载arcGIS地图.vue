/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-08
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 加载ArcGIS地图</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers" ></div>
    </div>
</template>
 
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import Zoom from 'ol/control/Zoom'
	import XYZ from "ol/source/XYZ";
	import FullScreen from 'ol/control/FullScreen'
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				// 地图实例
				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						new Tile({
							source: new XYZ({
								url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
							})
						})

					],
					view: new View({
						projection: "EPSG:4326",
						center: [114.064839, 22.548857], 
						zoom: 12
					}),
					controls:[
						// new Zoom()
						new FullScreen()
					]
				})
			},


		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container{
		width: 840px;
		height: 550px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 800px;
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

