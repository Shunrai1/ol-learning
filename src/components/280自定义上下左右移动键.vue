/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-07-18
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 自定义上下左右移动键</h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="moveMap('left')">向西</el-button>
			<el-button type="primary" size="mini" @click="moveMap('right')">向东</el-button>
			<el-button type="primary" size="mini" @click="moveMap('up')">向北</el-button>
			<el-button type="primary" size="mini" @click="moveMap('down')">向南</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import XYZ from 'ol/source/XYZ';
	import TileLayer from 'ol/layer/Tile';
	import {
		fromLonLat
	} from 'ol/proj'

	export default {
		name: 'direction',
		data() {
			return {
				map: null,
				view: null,
			}
		},
		methods: {
			moveMap(direction) {
				const delta = 50000; // 单位为像素

				
				switch (direction) {
					case 'up':
						this.view.animate({
							center: this.view.getCenter(),
							duration: 500
						});
						this.view.setCenter([this.view.getCenter()[0], this.view.getCenter()[1] - delta]);
						break;
					case 'down':
						this.view.animate({
							center: this.view.getCenter(),
							duration: 500
						});
						this.view.setCenter([this.view.getCenter()[0], this.view.getCenter()[1] + delta]);
						break;
					case 'left':
						this.view.animate({
							center: this.view.getCenter(),
							duration: 500
						});
						this.view.setCenter([this.view.getCenter()[0] - delta, this.view.getCenter()[1]]);
						break;
					case 'right':
						this.view.animate({
							center: this.view.getCenter(),
							duration: 500
						});
						this.view.setCenter([this.view.getCenter()[0] + delta, this.view.getCenter()[1]]);
						break;
				}
			},

			initMap() {

				this.map = new Map({
					layers: [
						new TileLayer({
							source: new XYZ({
								url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
							})
						}),

					],
					target: 'vue-openlayers',
					view: new View({
						center: fromLonLat([116, 39]),
						projection: "EPSG:3857",
						zoom: 3,
					}),
				});
				this.view = this.map.getView();
			},


		},
		mounted() {
			this.initMap();
		}
	}
</script>

<style scoped>
	.container {
		width: 960px;
		height: 660px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 920px;
		height: 480px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


