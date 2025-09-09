/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-28
*/
<template>
	<div class="container">
		<h3>vue+openlayers：显示indoor的各个楼层的商铺信息</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import IndoorEqual, { LevelControl } from 'openlayers-indoorequal';
	import 'openlayers-indoorequal/openlayers-indoorequal.css';
	export default {
		data() {
			return {
				map:null
			};
		},
		methods: {
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
					],
					view: new View({
                     center: [262616.26450171735, 6254013.833457053],
                     zoom: 18,
					}),
				});
              const key='iek_VpPLmIcjE8vIQ7dVhFr3zw3lqTHj';
			  const indoorEqual = new IndoorEqual(this.map, { apiKey: key, spriteBaseUrl: 'sprite/indoorequal' });			  
			  const control = new LevelControl(indoorEqual);
			  this.map.addControl(control);
			},
		},
		mounted() {
			this.initMap()
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 590px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


