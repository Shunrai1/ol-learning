/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-14
*/

<template>
	<div class="container">
		<h3>vue+openlayers：显示带箭头的线段，箭头居中</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers" ref="map" class="map-x"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {
		Map,
		View
	} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {
		Style,
		Stroke,
		Icon
	} from 'ol/style'
	import Feature from "ol/Feature";
	import {
		Point,
		LineString,
		Polygon
	} from "ol/geom";

	export default {
		data() {
			return {
				map: null,
				fea: null,
				source: new VectorSource({
					wrapX: false 
				}),
				markersData: [
					[112.44837595417002, 23.186590101623924, 1604627953],
					[112.26981796722073, 22.48475773547695, 1604714353],
					[113.96115972956521, 22.25412016222777, 1604800753],
					[113.44837595417002, 23.186590101623924, 1604887153],
				],
			}
		},
		methods: {

			addLine() {
				var LineStringFeature = new Feature(
					new LineString(this.markersData));
				LineStringFeature.setStyle(new Style({
					stroke: new Stroke({
						color: '#00f',
						width: 2
					})
				}))

				this.fea = LineStringFeature;
				this.source.addFeature(LineStringFeature);
			},

			arrowStyle() {
				let geometry = this.fea.getGeometry()
				let styles = []
				geometry.forEachSegment((start, end) => {
					let dx = end[0] - start[0]
					let dy = end[1] - start[1]
					let rotation = Math.atan2(dy, dx)
					let kx = (end[0] + start[0]) / 2;
					let ky = (end[1] + start[1]) / 2

					styles.push(new Style({
						geometry: new Point([kx, ky]),
						image: new Icon({
							src: require('@/assets/img/arrow.png'),
							anchor: [0.75, 0.5],
							rotateWithView: true,
							rotation: -rotation
						})
					}))
				})
				return styles
			},

			addPoint() {
				let features = [];
				let data = this.markersData;
				for (var i = 0; i < data.length; i++) {
					// 创建 Feature
					let feature = new Feature({
						geometry: new Point([data[i][0], data[i][1]]),
					})
					feature.setStyle(this.arrowStyle()) 
					features.push(feature)
				}
				this.source.addFeatures(features)
			},

			initMap() {

				let raster = new Tile({
					source: new OSM()
				});

				let vector = new VectorLayer({
					source: this.source,
				});

				this.map = new Map({
					target: this.$refs.map,
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.243045, 22.16871],
						zoom: 10
					})
				})
			   this.addLine();
			   this.addPoint()				
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
		margin: 0 auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
</style>

