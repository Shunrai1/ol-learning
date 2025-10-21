
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-14
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 绘制一个多边形，避免线段交叉，drawend有交叉提示并重绘</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click='paint()'>多边形</el-button>
			<el-button type="danger" size="mini" @click='clear()'>清除图层</el-button>
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
	import Draw from 'ol/interaction/Draw'
	import {
		defaults
	} from 'ol/interaction';
	import Polygon from 'ol/geom/Polygon'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import * as turf from '@turf/turf'

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
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
				});

				let vector = new LayerVector({
					source: this.source,
					// Vector层显示的样式
					style: new Style({
						fill: new Fill({
							color: [255, 0, 0, 0.1]
						}),
						stroke: new Stroke({
							width: 2,
							color: "#f00",
						}),
					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10
					}),
					//屏蔽双击放大事件       
					interactions: defaults({
						doubleClickZoom: false,
					})
				})
			},
			clear() {
				this.source.clear();
			},
			paint(x) {
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}
				this.draw = new Draw({
					source: this.source,
					type: 'Polygon',
				})
				this.map.addInteraction(this.draw)

				this.draw.on('drawend', (event) => {
					var feature = event.feature;
					console.log(feature)
					if (feature.getGeometry().getType() === "Polygon") {
						var poly = feature.getGeometry().getCoordinates();
						var kinkedPoly = turf.polygon(poly);
						var unkinkedPoly = turf.unkinkPolygon(kinkedPoly);
						if (unkinkedPoly.features.length > 1) {							
							this.$message.error("多边形的线段不能交叉，请重新绘制")
							setTimeout(()=>{
								this.clear()
							},500)
							
						}
					}

					this.map.removeInteraction(this.draw)
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


