
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
		<h3>vue+openlayers: 事件loadstart和loadend的示例</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import OSM from 'ol/source/OSM'

	export default {
		data() {
			return {
				map: null,
			};
		},

		methods: {
			loadEvent() {
				this.map.on('loadstart', () => {
					this.map.getTargetElement().classList.add('spinner');
				});
				this.map.on('loadend', () => {
					this.map.getTargetElement().classList.remove('spinner');
				});
			},

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
						projection: "EPSG:4326",
						center: [116.15, 40.79],
						zoom: 6
					}),
				})

			},
		},
		mounted() {
			this.initMap();
			this.loadEvent()
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
	}

	@keyframes spinner {
		to {
			transform: rotate(360deg);
		}
	}

	.spinner:after {
		content: "";
		box-sizing: border-box;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 40px;
		height: 40px;
		margin-top: -20px;
		margin-left: -20px;
		border-radius: 50%;
		border: 5px solid rgba(180, 180, 180, 0.6);
		border-top-color: rgba(0, 0, 0, 0.6);
		animation: spinner 0.6s linear infinite;
	}
</style>


