
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-07-11
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 普通加载vector图层，根据设定名称添加移除图层</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button size='mini' v-for="(item,i) in AOIs" :key="i" :type="item.isAOI?'primary':'danger'">
				<span @click="showAOI(i)" v-if="!item.isAOI"> {{item.layerName}}</span>
				<span @click="closeAOI(i)" v-if="item.isAOI"> {{item.layerName}}</span>
			</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {
		Map,
		View
	} from 'ol'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import Tile from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM'
	import {fromLonLat} from 'ol/proj'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Text from 'ol/style/Text'
	import Icon from 'ol/style/Icon'

	import Feature from 'ol/Feature'
	import {
		Point,
		LineString,
		Polygon
	} from "ol/geom"

	export default {
		name: 'VectorJSON',
		data() {
			return {
				map: null,
				AOIs: [{
						layerName: 'AOI001',
						isAOI: false,
						bound: {
							x1: 139.6485790340825,
							x2: 139.6769740340825,
							y1: 35.27194604343114,
							y2: 35.29464604343114
						}
					},
					{
						layerName: 'AOI002',
						isAOI: false,
						bound: {
							x1: 138.6485790340825,
							x2: 138.6769740340825,
							y1: 36.27194604343114,
							y2: 36.29464604343114
						}
					}
				],
			}
		},
		methods: {
			showAOI(i) {
				let polygonPoints = [
					[
						fromLonLat([this.AOIs[i].bound.x1, this.AOIs[i].bound.y1]),
						fromLonLat([this.AOIs[i].bound.x2, this.AOIs[i].bound.y1]),
						fromLonLat([this.AOIs[i].bound.x2, this.AOIs[i].bound.y2]),
						fromLonLat([this.AOIs[i].bound.x1, this.AOIs[i].bound.y2]),
						fromLonLat([this.AOIs[i].bound.x1, this.AOIs[i].bound.y1])
					]
				]
				const tipFeature = new Feature({
					geometry: new Polygon(polygonPoints),
				});

				let vecLayer = new LayerVector({
					zindex: 100,
					source: new SourceVector({
						features: [tipFeature],
					}),
					style: new Style({
						stroke: new Stroke({
							color: '#f00',
							width: 2
						}),
						fill: new Fill({
							color: [255, 255, 255, 0.1]
						})
					})
				})
				vecLayer.set('name', this.AOIs[i].layerName);
				this.map.addLayer(vecLayer);
				this.$set(this.AOIs[i], "isAOI", true);

				this.fixExtent(i);
			},

			closeAOI(i) {
				this.$set(this.AOIs[i], "isAOI", false);
				let that = this;
				this.map.getLayers().forEach(function(layer, index, array) {
					if (layer && layer.get("name") == that.AOIs[i].layerName) {
						that.map.removeLayer(layer)
					}
				})
				this.fixExtent(i);
			},
			
			fixExtent(i) {
				let geometry = new Polygon([
					[
						fromLonLat([this.AOIs[i].bound.x1, this.AOIs[i].bound.y1]),
						fromLonLat([this.AOIs[i].bound.x2, this.AOIs[i].bound.y1]),
						fromLonLat([this.AOIs[i].bound.x2, this.AOIs[i].bound.y2]),
						fromLonLat([this.AOIs[i].bound.x1, this.AOIs[i].bound.y2]),
						fromLonLat([this.AOIs[i].bound.x1, this.AOIs[i].bound.y1])
					]
				]);
				let size = this.map.getSize();
				this.map.getView().fit(geometry, {
					size: size,
					padding: [20, 20, 20, 20]
				})
			},

			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new OSM()
						})
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([116, 39]),
						zoom: 3,
						maxZoom: 20
					})
				})

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
