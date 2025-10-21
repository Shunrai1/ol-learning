/*
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-08-25
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 更改鼠标滚轮缩放地图大小，每次缩放小一点</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>当前zoom值：<span class="red">{{czoom}}</span></h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import XYZ from 'ol/source/XYZ';
	import TileLayer from 'ol/layer/Tile';
	import View from 'ol/View';
	import {MouseWheelZoom,defaults} from 'ol/interaction';

	export default {
		data() {
			return {
				map: null,
				czoom:3,
			}
		},
		methods: {
			initMap() {
				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						new TileLayer({
                    source: new XYZ({
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
                    })
						}),
					],
					view: new View({
						center: [13247019.404399557, 4721671.572580107],
						zoom: 3
					}),
					interactions: defaults({
						mouseWheelZoom: false
					}).extend([
						new MouseWheelZoom({
							maxDelta: 0.2, //核心代码
						}),
					]),
				})
				this.map.on('moveend',(e)=>{
					this.czoom=this.map.getView().getZoom()
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
		height: 590px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
	.red{color:red}
</style>

