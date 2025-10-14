/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-28
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 绘制点，判断它是否在一个电子围栏内</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="drawImage()">绘制点</el-button>
		</h4>
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
	import Fill from 'ol/style/Fill'
	import Feature from 'ol/Feature'
	import {Point,LineString,Circle,Polygon} from "ol/geom"
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import CircleStyle from 'ol/style/Circle'
	import Draw from 'ol/interaction/Draw'

	export default {
		data() {
			return {
				map: null,
				draw: null,
				source: new SourceVector({
					wrapX: false
				}),
				dataSource: new SourceVector({
					wrapX: false
				}),
				polygonData: [
					[
						[116.005, 39.005],
						[115.006, 40.008],
						[112.008, 39.008],
						[116.005, 39.005]
					]
				],
			}
		},

		methods: {
			// 显示多边形
			showPolygon() {
				let polygonFeature = new Feature({
					geometry: new Polygon(this.polygonData),
				})
				this.dataSource.addFeature(polygonFeature)
			},

			initMap() {
				let mapLayer = new Tile({
					source: new OSM()
				});

				let pointLayer = new LayerVector({
					source: this.source,
					style: new Style({
						fill: new Fill({
							color: "orange"
						}),
						stroke: new Stroke({
							width: 2,
							color: "darkgreen",
						}),
						image: new CircleStyle({ //点样式
							radius: 5,
							fill: new Fill({
								color: '#ff0000'
							})
						}),

					})
				});
				let weilan = new LayerVector({
					source: this.dataSource,
					style: new Style({
						fill: new Fill({
							color: "transparent"
						}),
						stroke: new Stroke({
							width: 2,
							color: "blue",
						}),

					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [mapLayer, weilan, pointLayer],
					view: new View({
						projection: "EPSG:4326",
						center: [115.006, 39.508],
						zoom: 8
					})
				})

			},
			drawImage() {
				this.source.clear()
				// 停止上一次的绘制，没有此代码会出现重叠
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}
				let type = 'Point'
				this.draw = new Draw({
					source: this.source,
					type: type,
				})
				this.map.addInteraction(this.draw)
				this.draw.on('drawend', (e) => {
					this.map.removeInteraction(this.draw)
					let coord = e.feature.getGeometry().getCoordinates() //获取最后点坐标
					let polygonGeometry = this.dataSource.getFeatures()[0].getGeometry();
					let flag = polygonGeometry.intersectsCoordinate(coord) //判断是否在Geometry内
					if (flag) {
						this.$message({
							type: 'success',
							duration: 1000,
							message: '在电子围栏内'
						})
					} else {
						this.$message({
							type: 'error',
							duration: 1000,
							message: '在电子围栏外'
						})
					}
				})
			},

		},
		mounted() {
			this.initMap();
			this.showPolygon();
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 600px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 800px;
		height: 430px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


