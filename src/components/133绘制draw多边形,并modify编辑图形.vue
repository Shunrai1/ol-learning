/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-09-15
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 绘制draw多边形，并modify编辑图形</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click='startDraw()'> 开始绘制</el-button>
			<el-button type="danger" size="mini" @click='endDraw()'> 停止再绘制</el-button>
			<el-button type="success" size="mini" @click='startModify()'> 开始修改</el-button>
			<el-button type="danger" size="mini" @click='endModify()'> 停止再修改</el-button>
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
	import Draw from 'ol/interaction/Draw'
	import Modify from 'ol/interaction/Modify'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	export default {
		data() {
			return {
				type: 'Polygon',
				map: null, // 地图
				draw: null,
				modify:null,
				source: new SourceVector({
					wrapX: false
				})
			}
		},

		methods: {

			startModify() {
				this.modify = new Modify({
					source: this.source,
				});
				this.map.addInteraction(this.modify);
			},
			endModify() {
				if (this.modify !== null) {
					this.map.removeInteraction(this.modify)
				}					
			},
			endDraw() {				
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}		
			},

			startDraw() {
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}

				if (this.type !== 'None') {
					this.draw = new Draw({
						source: this.source,
						type: this.type,

						style: new Style({
							fill: new Fill({
								color: "#0f0"
							}),
							stroke: new Stroke({
								width: 2,
								color: "#f00",
							}),
							image: new Circle({ //点样式
								radius: 5,
								fill: new Fill({
									color: '#00ff00'
								})
							}),
						})
					})
					this.map.addInteraction(this.draw)
				}
			},
			initMap() {
				let raster = new Tile({
					source: new OSM()
				});

				let vector = new LayerVector({
					source: this.source,
					style: new Style({
						fill: new Fill({
							color: "#00f"
						}),
						stroke: new Stroke({
							width: 2,
							color: "#ff0",
						}),
						image: new Circle({ //点样式
							radius: 5,
							fill: new Fill({
								color: '#ff0000'
							})
						}),
					})
				});
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10
					})
				})
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
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


