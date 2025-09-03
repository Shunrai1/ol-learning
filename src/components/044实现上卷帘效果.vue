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
		<h3>vue+openlayers：利用canvas clip 实现上卷帘功能</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<h4>
			<el-slider style="width: 500px; margin:0 auto;" v-model="swipeValue"></el-slider>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import TileLayer from 'ol/layer/Tile';
	import View from 'ol/View';
	import OSM from 'ol/source/OSM';
	import Stamen from 'ol/source/Stamen';
	import {fromLonLat} from 'ol/proj';
	import {getRenderPixel} from 'ol/render';

	export default {
		data() {
			return {
				swipeValue: 50,
				map:null
			};
		},
		watch:{
			swipeValue(oldVal,newVal){
				if(oldVal!=newVal){
					this.map.render()
				}
			}
		},

		methods: {

			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})
				let StamenMap = new TileLayer({
					source: new Stamen({
						layer: "watercolor",
					})
				});


				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
						StamenMap,
					],
					view: new View({
						projection: "EPSG:4326",
						center: [116, 39],
						zoom: 4
					}),
				});

				StamenMap.on('prerender', (event)=>{
					const ctx = event.context;
					const mapSize = this.map.getSize();
					const height = mapSize[1] * (this.swipeValue / 100);
					const tl = getRenderPixel(event, [0, height]);
					const tr = getRenderPixel(event, [mapSize[0], height]);
					const bl = getRenderPixel(event, [0, mapSize[1]]);
					const br = getRenderPixel(event, mapSize);

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(tl[0], tl[1]);
					ctx.lineTo(bl[0], bl[1]);
					ctx.lineTo(br[0], br[1]);
					ctx.lineTo(tr[0], tr[1]);
					ctx.closePath();
					ctx.clip();
				});

				StamenMap.on('postrender', function(event) {
					const ctx = event.context;
					ctx.restore();
				});

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
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


