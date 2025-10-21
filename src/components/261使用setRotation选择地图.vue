/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-03-13
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 使用setRotation旋转地图</h3>
		<p>大剑师兰特，还是大剑师兰特，gis-dajianshi</p>
		<h4>
			<el-button type="primary" size="mini" @click="add30()">顺时针旋转30度</el-button>
			<el-button type="primary" size="mini" @click="reduce30()">逆时针旋转30度</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import OSM from 'ol/source/OSM'
    import Layer from 'ol/layer/Layer.js';
	import TileLayer from 'ol/layer/Tile.js';
	import VectorSource from 'ol/source/Vector.js';

	export default {
		name: 'dajianshiDemo',
		data: function() {
			return {
				map: null,
				rotateDegree:0,
			}
		},
		methods: {
			add30(){				
				this.rotateDegree =this.rotateDegree+ 30
				this.map.getView().setRotation(this.rotateDegree*Math.PI/180)
			},
			reduce30(){
				this.rotateDegree=this.rotateDegree - 30
				this.map.getView().setRotation(this.rotateDegree*Math.PI/180)
			},
            
			initMap() {
				const layer = new TileLayer({
					source: new OSM()
				});
				this.map = new Map({
					layers: [
						layer
					],

					target: 'vue-openlayers',
					view: new View({
						center: [0, 0],
						projection: "EPSG:3857",
						zoom: 5,
					}),
				});

			},
		},
		mounted() {
			this.initMap();
		}
	}
</script>

<style scoped>
	.container {
		width: 1000px;
		height: 640px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


