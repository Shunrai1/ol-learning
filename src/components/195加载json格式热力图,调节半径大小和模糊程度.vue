
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-09
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载json格式热力图，调节半径大小和模糊程度</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<label>半径大小</label>
			<input id="radius" type="range" min="1" max="50" step="1" v-model="radius" @change="changeRadius" />

			<label>模糊半径</label>
			<input id="blur" type="range" min="1" max="50" step="1" v-model="blur" @change="changeBlur" />
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import Heatmap from 'ol/layer/Heatmap'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {Stamen} from 'ol/source' // Stamen是底图
	import HeatData from '@/assets/data/json/heatData.json' // 热力图数据
    import GeoJSON from 'ol/format/GeoJSON.js'; // 解析geojson格式	
	import { fromLonLat } from 'ol/proj'
	export default {
		data() {
			return {
				map: null,
				radius: 5,
				blur: 15,
				vector: new  ({ 
					name: '热力图',
					source: new VectorSource({
						features: new GeoJSON().readFeatures(HeatData, {
							dataProjection: "EPSG:4326",
							featureProjection: "EPSG:3857"
						})
					}),
					radius:15, // 半径大小
					blur: 20, // 模糊
					gradient: ["#00f", "#0ff", "#0f0", "#ff0", "#f00"], // 热力图颜色（可以不设置）
				})
			}
		},
		methods: {
			// 初始化地图
			initMap() {
				let StamenLayer = new TileLayer({
					source: new Stamen({
						layer: 'toner'
					})
				})

				this.map = new Map({
					target: 'vue-openlayers',
					layers: [StamenLayer, this.vector],
					view: new View({
						center: fromLonLat([176.841003, -39.639999]),
						zoom:6
					})
				})
			},
			changeRadius() {
				this.vector.setRadius(parseInt(this.radius, 10));
			},

			changeBlur() {
				this.vector.setBlur(parseInt(this.blur, 10))
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
		height: 620px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 800px;
		height: 460px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
</style>

