
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-06
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 利用canvas绘制边线纹路</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<span v-for="item in tools" :key="item.value" style="padding-right: 20px; cursor: pointer;"
				@click="changtype(item.value)">{{item.label}}</span>
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
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Draw from 'ol/interaction/Draw'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import {
		getCenter
	} from 'ol/extent'

	export default {
		data() {
			return {
				type: 'Polygon',
				tools: [{
						value: 'Polygon',
						label: '多边形'
					},
					{
						value: 'Circle',
						label: '圆'
					}
				],
				map: null, // 地图
				draw: null,
				source: new SourceVector({
					wrapX: false
				}),
				fdata: "",
			}
		},
		methods: {

			changtype(x) {
				this.type = x;
				this.addInteraction()
			},

			createPattern() {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
			 canvas.width = 4;
				canvas.height = 4;
				ctx.beginPath();
				ctx.rect(0, 0, 4, 4)
				ctx.strokeStyle = '#f00'; // 颜色可以根据需要更改
				ctx.stroke();
				return ctx.createPattern(canvas, 'repeat');
			},


			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
					})
				});

				let vector = new LayerVector({
					source: this.source,
					// Vector层显示的样式
					style: new Style({
						fill: new Fill({
							color: "#fff"
						}),
						stroke: new Stroke({
							width: 6,
							color: this.createPattern(),
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
				// this.addInteraction()
			},
			addInteraction() {
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
				} else {
					this.source.clear();
					this.fdata = '';
				}
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
		height: 660px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 500px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

