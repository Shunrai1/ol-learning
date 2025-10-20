
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-15
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 地图旋转移动动画、CSS缩放动画，介绍animate的使用方法</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click="go()">开始动画</el-button>
		</h4>
		<div id="vue-openlayers"></div>
		<div class="end" v-if="isEnd"> 恭喜发财 </div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {
		Map,
		View
	} from 'ol'
	import Tile from 'ol/layer/Tile'
	import BingMaps from 'ol/source/BingMaps';
	import {
		easeIn,
		easeOut,
		inAndOut,
		linear,
		upAndDown
	} from 'ol/easing'
	export default {
		data() {
			return {
				map: null,
				isEnd: false,
			}
		},
		methods: {

			go() {
				this.isEnd = false;
				this.map.getView().animate({
						zoom: 5,
						center: [116, 39],
						duration: 2000,
					},

					{
						zoom: 6,
						center: [114, 39],
						duration: 3000,
						rotation: Math.PI,
					}, {
						zoom: 9,
						center: [115, 37],
						duration: 4000,
						rotation: 2 * Math.PI,
					},
					() => {
						this.isEnd = true;
					}

				)
			},

			bing() {
				this.map.getLayers().getArray().forEach((layer) => {
					if (layer) {
						this.map.removeLayer(layer);
					}
				});

				let nsource = new BingMaps({
					key: 'AqQf9nX6PZKkFZOkdOqBOh3vg8xwGV1AYWGqC6EsOoJ0OHSUwm8CN8AhaFpT7mfR',
					imagerySet: "RoadOnDemand",
				})
				let bingMapLayer = new Tile({
					source: nsource,
					preload: Infinity
				});
				this.map.addLayer(bingMapLayer);
			},

			initMap() {

				this.map = new Map({
					target: "vue-openlayers",
					layers: [],
					view: new View({
						center: [122, 47],
						zoom: 4,
						projection: "EPSG:4326",
					}),
					loadTilesWhileAnimating: true,
				})
				this.bing()
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
		height: 590px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position:relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

	.end {
		position: absolute;
		left:320px;
		top: 240px;
		width: 200px;
		height: 100px;
		text-align: center;
		font-size: 28px;
		line-height: 100px;
		background-color: red;
		color: #fff;
		animation: myfirst 5s;
	}	
	@keyframes myfirst
	{
	    from {background: red;  transform: scale(2);}
	    to {background: yellow;  transform: scale(1);}
	}
</style>


