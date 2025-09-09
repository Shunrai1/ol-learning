/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-30
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 使用gifler加载gif动画</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import VectorSource from 'ol/source/Vector';
	import VectorLayer from 'ol/layer/Vector';
	import GeoJSON from 'ol/format/GeoJSON';
	import {Tile} from 'ol/layer';
	import Stamen from 'ol/source/Stamen';
	import Feature from 'ol/Feature'
	import {Point} from "ol/geom"

	import Style from 'ol/style/Style'

	import Icon from 'ol/style/Icon'

	export default {
		name: 'geoJSON',
		data() {
			return {
				map: null,
				view: new View({
					projection: "EPSG:4326",
					center: [116, 39], 
					zoom: 1
				})
			}
		},
		methods: {
			initMap() {

				const iconFeature = new Feature({
					geometry: new Point([116, 39]),
				});
				const vectorLayer = new VectorLayer({
					source: new VectorSource({
					   features: [iconFeature],
				     })
				});

				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new Stamen({
								layer: 'watercolor'
							})
						}),
						vectorLayer
					],
					view: this.view
				})

				// const gifUrl = '@assets/data/globe.gif';
				// 会出现错误 gifler.min.js:2 Uncaught Invalid GIF 87a/89a header.
				const gifUrl = '/globe2.gif'; //位于public文件夹下
				const gif = gifler(gifUrl);
                // 注意this指向,使用箭头函数减少烦恼
				gif.frames(
					document.createElement('canvas'),
					(ctx, frame) => {
						if (!iconFeature.getStyle()) {
							iconFeature.setStyle(
								new Style({
									image: new Icon({
										img: ctx.canvas,
										imgSize: [frame.width, frame.height],
										opacity: 0.8,
									}),
								})
							);
						}
						ctx.clearRect(0, 0, frame.width, frame.height);
						ctx.drawImage(frame.buffer, frame.x, frame.y);
						this.map.render();
					},
					true
				);

			}
		},
		mounted() {
			this.initMap()
		}
	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 550px;
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
</style>

