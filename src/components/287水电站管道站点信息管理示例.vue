/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in CSDN
* @First published time: 2023-08-12
*/

<template>
	<div class="container">
		<div id="map"></div>
		<div class="leftpart">
			<div class="onelineL">
				<div class="on" v-show="yaliAll" @click="removeAllPoints('yali')"> 压力监测点</div>
				<div class="off" v-show="!yaliAll" @click="addAllPoints('yali')"> 压力监测点</div>
			</div>
			<div class="onelineL">
				<div class="on" v-show="yeweiAll" @click="removeAllPoints('yewei')"> 液位监测点</div>
				<div class="off" v-show="!yeweiAll" @click="addAllPoints('yewei')"> 液位监测点</div>
			</div>
			<div class="onelineL">
				<div class="on" v-show="show1200" @click="hideOneLine('1200')"> 200蓝色管道</div>
				<div class="off" v-show="!show1200" @click="showOneLine('1200')"> 200蓝色管道</div>
			</div>
			<div class="onelineL">
				<div class="on" v-show="show1400" @click="hideOneLine('1400')"> 400绿色管道</div>
				<div class="off" v-show="!show1400" @click="showOneLine('1400')"> 400绿色管道</div>
			</div>
			<div class="onelineL">
				<div class="on" v-show="show1500" @click="hideOneLine('1500')"> 500红色管道</div>
				<div class="off" v-show="!show1500" @click="showOneLine('1500')"> 500红色管道</div>
			</div>
		</div>
		<div class="rightpart">
			<div class="onelineR" v-for="(item,index) in points" :key="index">
				<div class="r1">{{index+1}}</div>
				<div class="r2" @click='panCenter(item)'>{{item.wrname}}</div>
				<div class="r3">
					<el-switch v-model="item.isShow" active-color="#13ce66" inactive-color="#ff4949"
						@change="changeStatus(item.isShow,index)">
					</el-switch>
				</div>
			</div>
		</div>
		<el-dialog title="点位信息" :visible.sync="centerDialogVisible" width="20%" :modal="false" center>
			<div v-if="dialogInfo.name">{{dialogInfo.name}}</div>
			<div v-else>
				<span>{{dialogInfo.wrname}}</span>
				<span>{{dialogInfo.location}}</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Feature from 'ol/Feature'
	import {Point,LineString} from 'ol/geom'
	import {Icon,Text,Fill,Stroke,Style,Circle} from 'ol/style'
	import {transform} from 'ol/proj'
	import lineData1500 from '../assets/gis/line1500.js'
	import lineData1400 from '../assets/gis/line1400.js'
	import lineData1200 from '../assets/gis/line1200.js'
	import pointData from '../assets/gis/points.js'
	import {closestOnSegment} from 'ol/coordinate';

	export default {
		name: 'GIS_Map',
		data() {
			return {
				map: null, // 地图
				source: new VectorSource({
					wrapX: false
				}),
				points: pointData,
				showTypeList: ['压力监测点', '液位监测点', 'DN1200管道', 'DN1400管道', 'DN1500管道'],
				checkedType: ['压力监测点', '液位监测点', 'DN1200管道', 'DN1400管道', 'DN1500管道'],
				centerDialogVisible: false,
				dialogInfo: {},
				yaliAll: true,
				yeweiAll: true,
				show1200: true,
				show1400: true,
				show1500: true,
				lineFeatureDN1200: null,
				lineFeatureDN1400: null,
				lineFeatureDN1500: null,
				layerDN1200: null,
				layerDN1400: null,
				layerDN1500: null,
				layerDN1200Arrow: null,
				layerDN1400Arrow: null,
				layerDN1500Arrow: null,
			}
		},
		//挂载
		mounted() {
			this.initMap()
			this.addLine(lineData1200, 'DN1200')
			this.addLine(lineData1400, 'DN1400')
			this.addLine(lineData1500, 'DN1500')
			this.arrowPoint(lineData1200, 'DN1200')
			this.arrowPoint(lineData1400, 'DN1400')
			this.arrowPoint(lineData1500, 'DN1500')
			this.loadPoints()
		},
		methods: {
			// 判断是否全选状态
			judgeAll() {
				let flag_yali = 0
				let flag_yewei = 0
				for (let i = 0; i < this.points.length; i++) {
					if (this.points[i].isShow == false) {
						if (this.points[i].type == 'yali') {
							flag_yali++
						}
						if (this.points[i].type == 'yewei') {
							flag_yewei++
						}
					}
				}
				if (flag_yali > 0) {
					this.yaliAll = false
				} else {
					this.yaliAll = true
				}
				if (flag_yewei > 0) {
					this.yeweiAll = false
				} else {
					this.yeweiAll = true
				}
			},

			// 更改单点显示状态
			changeStatus(status, index) {
				if (status) {
					this.addOnePoint(index);
					this.judgeAll()
				} else {
					this.removeOnePoint(index)
					this.judgeAll()
				}
			},
			// 加载所有点层
			loadPoints() {
				for (let i = 0; i < this.points.length; i++) {
					if (this.points[i].isShow) {
						this.addOnePoint(i)
					}
				}
			},
			// 添加一个点层
			addOnePoint(i) {
				let pointFeature = new Feature({
					geometry: new Point(transform([this.points[i].x, this.points[i].y], 'EPSG:4326', 'EPSG:3857')),
					data: this.points[i]
				})
				pointFeature.setStyle(this.pointStyle(this.points[i]))
				let onePointLayer = new VectorLayer({
					source: new VectorSource(),
					zIndex: 20,
					listsindex: 's' + i,
					declutter: true,
				})
				onePointLayer.getSource().addFeature(pointFeature)
				this.map.addLayer(onePointLayer);
			},
			// 去掉一个点层
			removeOnePoint(i) {
				this.map.getLayers().forEach((layer) => {
					if (layer && layer.get("listsindex") == 's' + i) {
						this.map.removeLayer(layer)
					}
				})
			},
			// 全选某组数据
			addAllPoints(type) {
				// 先清除此类型图层,然后添加图层							
				this.removeAllPoints(type)
				switch (type) {
					case 'yali':
						this.yaliAll = true;
						break
					case 'yewei':
						this.yeweiAll = true;
						break
				}

				for (let i = 0; i < this.points.length; i++) {
					if (this.points[i].type == type) {
						this.$set(this.points[i], "isShow", true);
						this.addOnePoint(i);
					}
				}
			},
			// 全不选某组数据
			removeAllPoints(type) {
				switch (type) {
					case 'yali':
						this.yaliAll = false;
						break
					case 'yewei':
						this.yeweiAll = false;
						break
				}

				for (let i = 0; i < this.points.length; i++) {
					if (this.points[i].type == type) {
						this.removeOnePoint(i);
						this.$set(this.points[i], "isShow", false);
					}
				}
			},
			//显示某线路层
			showOneLine(x) {
				switch (x) {
				 case '1200':
						this.show1200 = true;
						this.layerDN1200.setVisible(true);
						this.layerDN1200Arrow.setVisible(true);
				 	break
					case '1400':
						this.show1400 = true;
						this.layerDN1400.setVisible(true);
						this.layerDN1400Arrow.setVisible(true);
						break
					case '1500':
						this.show1500 = true;
						this.layerDN1500.setVisible(true);
						this.layerDN1500Arrow.setVisible(true);
						break
				}
			},
			//隐藏某线路层
			hideOneLine(x) {
				switch (x) {
					case '1200':
						this.show1200 = false;
						this.layerDN1200.setVisible(false);
						this.layerDN1200Arrow.setVisible(false);
						break
					case '1400':
						this.show1400 = false;
						this.layerDN1400.setVisible(false);
						this.layerDN1400Arrow.setVisible(false);
						break
					case '1500':
						this.show1500 = false;
						this.layerDN1500.setVisible(false);
						this.layerDN1500Arrow.setVisible(false);
						break
				}
			},
			//定位使其为中心点
			panCenter(item) {
				this.map.getView().setCenter(transform([item.x, item.y], 'EPSG:4326', 'EPSG:3857'))
				this.map.getView().setZoom(19)
			},

			// 绘制管道
			addLine(lines, type) {
				let newArr = lines.map(item => {
					return transform(item, 'EPSG:4326', 'EPSG:3857')
				})
				this[`layer${type}`] = new VectorLayer({
					source: new VectorSource(),
					zIndex: 5
				})
				this.map.addLayer(this[`layer${type}`])
				this[`lineFeature${type}`] = new Feature({
					geometry: new LineString(newArr),
					data: {
						name: type
					}
				})
				const colorList = {
					'DN1200': '#00f',
					'DN1500': '#ff0000',
					'DN1400': '#00ff22'
				}
				let lineStyle = new Style({
					fill: new Fill({
						color: colorList[type]
					}),
					stroke: new Stroke({
						width: 10,
						color: colorList[type]
					})
				})
				this[`lineFeature${type}`].setStyle(lineStyle)
				this[`layer${type}`].getSource().addFeature(this[`lineFeature${type}`])
			},

			arrowStyle(type) {
				let geometry = this[`lineFeature${type}`].getGeometry()
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
							src: require('@/assets/gis/arrow.png'),
							anchor: [0.75, 0.5],
							rotateWithView: true,
							rotation: -rotation
						})
					}))
				})
				return styles
			},

			arrowPoint(lines, type) {
				let features = [];
				let data = lines;
				for (var i = 0; i < data.length; i++) {
					// 创建 Feature
					let feature = new Feature({
						geometry: new Point(transform([data[i][0], data[i][1]], 'EPSG:4326', 'EPSG:3857')),
					})
					feature.setStyle(this.arrowStyle(type))
					features.push(feature)
				}
				this[`layer${type}Arrow`] = new VectorLayer({
					source: new VectorSource(),
					zIndex: 8
				})
				this.map.addLayer(this[`layer${type}Arrow`])
				this[`layer${type}Arrow`].getSource().addFeatures(features)
			},


			pointStyle(item) {
				let src = require('@/assets/gis/wushui.svg')
				switch (item.type) {
					case 'bengzhan':
						src = require('@/assets/gis/bengzhan.svg')
						break
					case 'wushui':
						src = require('@/assets/gis/wushui.svg')
						break
					case 'yali':
						src = require('@/assets/gis/yali_jiance.svg')
						break
					case 'yewei':
						src = require('@/assets/gis/shuiwei_jiance.svg')
						break
					default:
						src = require('@/assets/gis/wushui.svg')
				}
				let backColor = {
					'bengzhan': 'rgb(105,64,245)',
					'wushui': 'rgb(134,173,194)',
					'yali': 'rgba(245,44,12,0.7)',
					'yewei': 'rgba(20,245,12,0.7)'
				}
				let textColor = {
					'bengzhan': 'rgba(236,218,20,1)',
					'wushui': 'rgba(236,218,20,1)',
					'yali': 'rgba(236,218,20,1)',
					'yewei': 'rgb(17,17,17)'
				}
				let styleIcon = new Style({
					// 设置图片效果
					image: new Icon({
						src: src,
						scale: (item.type === 'bengzhan' || item.type === 'wushui') ? 0.3 : 0.15
					}),
					text: new Text({
						font: 'normal 14px 黑体',
						// // 对其方式
						textAlign: 'center',
						// 基准线
						textBaseline: 'middle',
						offsetY: item.offsetY || -35,
						offsetX: item.offsetX || 0,
						backgroundFill: new Stroke({
							color: backColor[item.type]
						}),
						// 文本填充样式
						fill: new Fill({
							color: textColor[item.type]
						}),
						padding: [5, 5, 5, 5],
						text: item.wrname
					})
				})
				return styleIcon
			},
			// 初始化底图map
			initMap() {
				// 初始化地图
				const baseMap = new TileLayer({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
				})
				this.map = new Map({
					layers: [baseMap],
					target: 'map',
					view: new View({
						center: transform([112.87, 28.19], 'EPSG:4326', 'EPSG:3857'),
						zoom: 15,
						minZoom: 13,
						maxZoom: 21
					})
				})
				this.clickMap()
			},
			clickMap() {
				let that = this
				this.map.on('click', (e) => {
					let feature = this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
						return feature
					})
					this.dialogInfo = {}
					if (feature) {
						console.log('feature--', feature.get('data'))
						that.dialogInfo = feature.get('data')
						this.centerDialogVisible = true
					} else {
						this.centerDialogVisible = false
					}
				})
			}

		}
	}
</script>

<style scoped>
	.container {
		width: 100%;
		height: 98vh;
		overflow: hidden;
		position: relative;
	}

	.container .leftpart {
		position: absolute;
		left: 0;
		top: 0;
		width: 130px;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.8);
		text-align: left;
		padding-top: 100px;
		box-shadow:  1px 1px 10px 10px rgba(0,0,0,0.2);
	}

	.container .rightpart {
		padding: 0 5px 0 10px;
		position: absolute;
		right: 0;
		top: 0;
		width: 320px;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.8);
		text-align: left;
		overflow-y: auto;
		box-shadow:  1px 1px 10px 10px rgba(0,0,0,0.2);
	}

	.onelineR {
		width: 285px;
		height: 30px;
		overflow: hidden;
	}

	.r1 {
		width: 40px;
		float: left;
		display: inline-block;
	}

	.r2 {
		width: 205px;
		float: left;
		display: inline-block;
		cursor: pointer
	}

	.r3 {
		width: 40px;
		float: left;
		display: inline-block;
	}

	.onelineL {
		width: 150px;
		height: 30px;
		overflow: hidden;
	}

	.on,
	.off {
		width: 130px;
		cursor: pointer;
		height: 30px;
		line-height: 30px;
		background-size: 14px 14px;
		padding-left: 20px;
	}

	.on {
		background: url('../assets/gis/selected.png') left center no-repeat;
	}

	.off {
		background: url('../assets/gis/unselect.png') left center no-repeat;
	}

	#map {
		width: 100%;
		height: 100%;
	}
	.el-dialog{
		 box-shadow: 3px 3px rgba(0,0,0,.2);
		border: 1px solid rgba(255,0,0,.5)
	}
	
</style>



