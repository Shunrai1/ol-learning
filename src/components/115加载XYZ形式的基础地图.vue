/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-08-31
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载XYZ地图的示例</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'

	export default {
		data() {
			return {
				map: null,
				geo_Layer:null,			
			};
		},

		methods: {

			initMap() {
                            //    let xyzurl='XXX url地址'；
				this.geo_Layer =  new TileLayer({
					source: new XYZ({
						 url: xyzurl
					}),
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						this.geo_Layer
					],
					view: new View({
						projection: "EPSG:4326",
						center: [100.15, 16.79],
						zoom: 5
					}),
				})
              
			},
		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container {
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
		background-color: gold;
	}

</style>


