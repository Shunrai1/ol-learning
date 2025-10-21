
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
		<h3>vue+openlayers: 利用 Point 显示点</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="go()">显示多点</el-button>
			<el-button type="danger" size="mini" @click="clearImage()">清除图形</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Fill from 'ol/style/Fill'
	import Style from 'ol/style/Style'
	import CircleStyle from 'ol/style/Circle'
	import Feature from 'ol/Feature'
	import {Point} from "ol/geom";

	export default {
		data() {
			return {
				map: null,
				source: new SourceVector({
					wrapX: false
				}),
				PointData: [115, 39],
	
				PointLayer: null,
			}
		},

		methods: {
			go() {
				let PointFeature = new Feature({
					geometry: new Point(this.PointData),
				});
				this.source.addFeature(PointFeature);
			},

			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
					})
				});

				this.PointLayer = new LayerVector({
					source: this.source,
					style: new Style({
						image: new CircleStyle({ //点样式
							radius: 30,
							fill: new Fill({
								color: '#ff00ff'
							})
						}),

					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster, this.PointLayer],
					view: new View({
						projection: "EPSG:4326",
						center: [115, 39],
						zoom: 10
					})
				})

			},
			clearImage() {
				this.source.clear()
			},

		},
		mounted() {
			this.initMap()
		}
	}
</script>
<style scoped>
	.container {
		width: 1000px;
		height: 660px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 490px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>



