/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-04-26
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 输入经纬度坐标，校验并在地图上标记点，enter提交</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4 style="width: 40%; margin:0 auto 20px;">
			<el-input v-model="pointCoord" placeholder="经度,纬度" size="mini" @keyup.enter.native='showPoint()'>
				<el-button slot="append" icon="el-icon-search" @click="showPoint()"></el-button>
			</el-input>
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
	import {Point} from "ol/geom"
	import Feature from 'ol/Feature'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Icon from 'ol/style/Icon'
	import {fromLonLat} from 'ol/proj'

	export default {
		data() {
			return {
				map: null, // 地图
				draw: null,
				source: new SourceVector({
					wrapX: false
				}),
				pointCoord: '',
			}
		},

		methods: {
			showPoint() {
				this.source.clear()
				if (this.pointCoord && this.pointCoord.includes(',') && this.pointCoord.indexOf(",") == this.pointCoord
					.lastIndexOf(",")) {
					let arr = this.pointCoord.split(',')
					if (arr[0] < 180 && arr[0] > -180 && arr[1] < 90 && arr[1] > -90) {
						let lon = Number(arr[0]);
						let lat = Number(arr[1]);
						let pointFeature = new Feature({
							geometry: new Point(fromLonLat([lon, lat])),
						})
						this.source.addFeature(pointFeature)
						this.map.getView().setCenter(fromLonLat([lon, lat]))
					} else {
						this.$message({
							type: "error",
							message: '坐标填写错误，请重新输入'
						})
					}
				} else {
					this.$message({
						type: "error",
						message: '坐标填写错误，请重新输入'
					})
				}
			},
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						 crossOrigin: "anonymous"
					})
				});

				let vector = new LayerVector({
					source: this.source,
					style: new Style({
						fill: new Fill({
							color: [0, 0, 255, 0.001]
						}),
						stroke: new Stroke({
							width: 2,
							color: "#f0f",
						}),
						image: new Icon({ //点样式
							src: require('@/assets/img/location.png'),
						}),
					}),
				})

				this.map = new Map({
					target: 'vue-openlayers',
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-113.1206, 23.034996]),
						zoom: 3
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


