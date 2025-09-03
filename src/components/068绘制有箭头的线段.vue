/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-18
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 绘制带有箭头的线</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>

		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Draw from 'ol/interaction/Draw'
	import Point from 'ol/geom/Point';
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import {get} from 'ol/proj';
	export default {
		data() {
			return {
				map: null, // 地图
				draw: null,
				source: new SourceVector({
					wrapX: false
				})
			}
		},
		methods: {

			styleFunction(feature) {
				const geometry = feature.getGeometry();
				const styles = [
					new Style({
						stroke: new Stroke({
							color: 'purple',
							width: 2,
						}),
					}),
				];

				geometry.forEachSegment(function(start, end) {
					const dx = end[0] - start[0];
					const dy = end[1] - start[1];
					const rotation = Math.atan2(dy, dx);
					// arrows
					styles.push(
						new Style({
							geometry: new Point(end),
							image: new Icon({
								src: require('@/assets/img/arrow.png'),
								anchor: [0.75, 0.5],
								rotateWithView: true,
								rotation: -rotation,
							}),
						})
					);
				});
				return styles;
			},

			addInteraction() {
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}

				this.draw = new Draw({
					source: this.source,
					type: 'LineString',
				})
				this.map.addInteraction(this.draw)
			},

			initMap() {
			
				let raster = new Tile({
					source: new OSM()
				});

				let vector = new LayerVector({
					source: this.source,
					style: this.styleFunction
				});
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10,
					})
				})
				this.addInteraction()
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
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


