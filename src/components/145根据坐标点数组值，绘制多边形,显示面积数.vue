
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-10-18
*/

<template>
	<div class="container">
		<h3>vue+openlayers：根据坐标点数组值，绘制多边形，显示面积数</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="showPolygon()">显示多边形</el-button>
			<el-button type="primary" size="mini" @click="showG()">显示面积</el-button>
			<el-button type="primary" size="mini" @click="clearLayer()">清除图层</el-button>
		</h4>
		<div id="vue-openlayers"></div>
		<!-- AOI面积弹窗信息-->
		<div id="tipBox" class="popup" v-show="isShowTip">
			<div class="popup-closer" @click="closeTip()"></div>
			<div id="aoiArea"></div>
		</div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import OSM from 'ol/source/OSM'
	import Feature from 'ol/Feature'
	import {Point,LineString,Circle,Polygon} from "ol/geom"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import CircleStyle from 'ol/style/Circle'
	import Overlay from 'ol/Overlay'
	import {getArea,getLength} from 'ol/sphere';
	import {fromLonLat,toLonLat,transform} from "ol/proj";

	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
				isShowTip: false,
				areaTip: null,
				polygonData: [
					[-72.16, 41.4134],
					[-72.0176, 41.3896],
					[-72.0643, 41.23],
					[-72.2064, 41.2537],
					[-72.16, 41.4134]
				],
			};
		},

		methods: {
			// 设置vector样式
			featureStyle() {
				let style = new Style({
					fill: new Fill({
						color: "rgba(255,255,255,0.1)"
					}),
					stroke: new Stroke({
						width: 2,
						color: "#f0f",
					}),
					image: new CircleStyle({ //点样式
						radius: 10,
						fill: new Fill({
							color: '#ff0000'
						})
					}),
				})
				return style
			},
			// 清除vector数据源
			clearLayer() {
				this.dataSource.clear();
			},

			// 显示多边形
			showPolygon() {
				let array = this.polygonData;
				let polygonArray = []
				for (let i = 0; i < array.length; i++) {
					let lng = array[i][0];
					let lat = array[i][1];
					let temp = fromLonLat([lng, lat])
					polygonArray.push(temp)
				}

				let polygonFeature = new Feature({
					geometry: new Polygon([polygonArray]),
				})
				this.dataSource.addFeature(polygonFeature)
			},

			showG() {
				if (this.dataSource.getFeatures().length != 0) {
					let g = this.dataSource.getFeatures()[0].getGeometry()
					this.showAreaTip(g)
				}

			},
			closeTip() {
				this.areaTip.setPosition(undefined)
			},

			showAreaTip(geometry) {
				this.isShowTip = true;
				let tipBox = document.getElementById('tipBox');
				let aoiAreaInfo = document.getElementById('aoiArea');

				this.areaTip = new Overlay({
					element: tipBox,
					offset: [0, -15],
					positioning: 'bottom-center',
					color: '#f00'
				});
				this.map.addOverlay(this.areaTip);
				let area = getArea(geometry)
				console.log(area / 1000000)
				let areaKM = Math.round(area / 1000000);
				let areaKMlocal = Number(areaKM).toLocaleString()
				aoiAreaInfo.innerHTML = '≈' + areaKMlocal + 'km<sup>2</sup>';
				this.areaTip.setPosition(geometry.getLastCoordinate())
			},

			// 初始化地图     
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})
				let feature_Layer = new VectorLayer({
					source: this.dataSource,
					style: this.featureStyle() //统一设置vector样式
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
						feature_Layer
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-72.16, 41.4134]),
						zoom: 10
					}),
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
		height: 570px;
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

	.popup {
		position: absolute;
		background-color: white;
		color: #f0f;
		padding: 5px 35px 5px 10px;
		bottom: 5px;
		left: -50px;
		font-size: 16px;
		border-radius: 4px;
		box-shadow: 0 1px 5px #999
	}

	.popup-closer {
		text-decoration: none;
		position: absolute;
		top: 1px;
		right: 8px;
		cursor: pointer;
	}

	.popup-closer:after {
		content: "×";
		font-size: 26px;
	}
</style>


