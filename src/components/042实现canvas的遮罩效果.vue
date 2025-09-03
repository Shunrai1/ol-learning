/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-04
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 实现canvas遮罩效果</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>
		<div id="info"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import XYZ from "ol/source/XYZ";
	// import Stamen from 'ol/source/Stamen';
	import {transform} from 'ol/proj';

	export default {
		name: 'cluster',
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
                let StamenLayer=new TileLayer({
							source: new XYZ({
								url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

							})
						})
						
				this.map = new Map({
					layers: [
						StamenLayer
					],
					target: 'vue-openlayers',
					view: new View({
						center: transform([20, 37.0902], "EPSG:4326", "EPSG:3857"),
						projection: "EPSG:3857",
						zoom: 2,
					}),
				});
  
			  StamenLayer.on('postrender', event => {
			  
				var ctx = event.context;
				ctx.save()
				var pixelRatio = event.frameState.pixelRatio;
				var size = this.map.getSize();
				// 平移
				ctx.translate(size[0] / 2 * pixelRatio, size[1] / 2 * pixelRatio);
				//缩放
				ctx.scale(3 * pixelRatio, 3 * pixelRatio);
				//平移
				ctx.translate(-75, -80);
				ctx.beginPath();
				ctx.moveTo(75, 40);
				ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
				ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
				ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
				ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
				ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
				ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
				ctx.clip();
				ctx.translate(75, 80);
				ctx.scale(1 / 3 / pixelRatio, 1 / 3 / pixelRatio);
				ctx.translate(-size[0] / 2 * pixelRatio, -size[1] / 2 * pixelRatio);
			  })
			  
			  StamenLayer.on('rendercomplete', function(event) {
				var ctx = event.context;
				 ctx.restore();
			  });
			},
		},
		mounted() {
			this.initMap();
		},
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



