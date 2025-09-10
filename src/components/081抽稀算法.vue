/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-05
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 抽稀算法，展示轨迹</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="showTrace(markersData)">原数据轨迹</el-button>
			<el-button type="primary" size="mini" @click="chouxi()">抽稀数据轨迹</el-button>
			<el-button type="primary" size="mini" @click="clearMarker()">清除</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import Text from 'ol/style/Text'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Feature from 'ol/Feature'
	import {Point,LineString,Polygon} from "ol/geom"
	import simplifyGeometry from "@/assets/js/simplifygeometry-0.0.2.min.js"
	import DateExtent from "@/assets/js/DateExtent.js"
	export default {
		data() {
			return {
				map: null,
				trackSource: new VectorSource(),
				markersData: [
					[112.44837595417002, 23.186590101623924, 1604627953],
					[112.26981796722073, 22.48475773547695, 1604714353],
					[113.96115972956521, 22.25412016222777, 1604800753],
					[113.44837595417002, 23.186590101623924, 1604887153],
					[113.44837595417002, 23.986590101623924, 1605059953],
					[113.54837595417002, 24.686590101623924, 1605146353]
				],
			}
		},
		methods: {
			clearMarker() {
				this.trackSource.clear()
			},
            chouxi() {            
            	let mydata = simplifyGeometry(this.markersData, 1);
            	this.showTrace(mydata)
            },
			setTrackStyle(text, img) {
				let Styles = []
				Styles.push(
					new Style({
						// 设置图标
						image: new Icon({
							src: img,
							anchor: [0.5, 0.5],
							scale: 1,
						}),
						// 设置图片下面显示字体的样式和内容
						text: new Text({
							font: '12px sans-serif', // 设置字体
							maxAngle: 30,
							offsetx: 50, // 设置文字偏移量
							offsetY: 20,
							text: text, // 文字描述
							fill: new Fill({
								color: '#fff',
							}),
							backgroundFill: new Fill({
								color: 'rgba(0,0,0,0.6)'
							}),
							backgroundStroke: new Stroke({
								color: 'rgba(0,0,0,0.6)',
								width: 8,
							}),

						}),
					})
				)
				return Styles
			},
			showTrace(data) {
				this.clearMarker();
				var LineStringFeature = new Feature(
					new LineString(data));
				LineStringFeature.setStyle(new Style({
					stroke: new Stroke({
						color: '#00f',
						width: 2
					})
				}))
				this.trackSource.addFeature(LineStringFeature);
			
				let features = []
				let img = ''
				for (var i = 0; i < data.length; i++) {
					if (i == 0) {
						img = require('@/assets/img/startPoint.png')
					} else if (i == data.length - 1) {
						img = require('@/assets/img/endPoint.png')
					} else {
						img = require('@/assets/img/point.png')
					}
					// 创建 Feature
					let feature = new Feature({
						geometry: new Point([data[i][0], data[i][1]]),
						data: data[i], 
					})
					let time = new Date(data[i][2] * 1000).Format("yyyy-MM-dd");
					feature.setStyle(this.setTrackStyle("时间:" + time, img)) 
					features.push(feature)
				}
				this.trackSource.addFeatures(features)
			},

			initMap() {
              let OSMlayer = new Tile({
              	source: new OSM(),
              	visible: true,
              	zIndex: 1,
              })
              let trackLayer = new VectorLayer({
              	source: this.trackSource,
              	zIndex: 9,
              })
				this.map = new Map({
					target: "vue-openlayers",
					layers: [OSMlayer,trackLayer],
					view: new View({
						center: [113.448, 23.986],
						zoom: 7,
						projection: "EPSG:4326",
					}),
				})

			},

		},
		mounted() {
			this.initMap();
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


