/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-31
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 地图中间位置闪烁点动画（封装代码版）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import Stamen from 'ol/source/Stamen';
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {

			initMap() {

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						new Tile({
							source: new Stamen({
						 	layer: "terrain",
							})
						})
					],
					view: new View({
						center: [116.53, 39.44],
						zoom: 3
					})
				})

				let lnglat = [116.53450137499999, 39.44104525]; //坐标值[x,y]
				let citys = [{
					name: 'shinePoint',
					lnglat: lnglat,
					color: '#ff0000',
					type: 'circle',  //ellipse
					speed: 0.5,
			 }];
				var flashMarker = new window.FlashMarker(this.map, citys);

			}
		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 520px;
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

