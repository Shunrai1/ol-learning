/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in CSDN
* @First published time: 2023-08-11
*/
<template>
	<div class="container">
		<h3>Openlayers界面控制综合演示</h3>
		<p>还是大剑师兰特：openlayers实战课程</p>
		<div id="vue-openlayers" class="map-x">
			<div class="zoomin" @click="zoomin()">+</div>
			<div class="zoomvalue">{{ zoomValue}}</div>
			<div class="zoomout" @click="zoomout()">-</div>
			<div class="measureLength" @click="getLength('length')"><i class="el-icon-watermelon"></i></div>
			<div class="measureArea" @click="getLength('area')"><i class="el-icon-house"></i></div>
			<div class="clear" @click="clear()"><i class="el-icon-circle-close"></i></div>
			<div id="mouse"></div>
			<el-tooltip class="item" effect="light" placement="left">
				<div slot="content">
					<div class="mapbox">
						<li @click="MapChangeType('1')" :class="active[0]?'activeStyle':''"><img
								src="../assets/img/osm-map.png">
							<div class="on">ArcGis</div>
						</li>
						<li @click="MapChangeType('2')" :class="active[1]?'activeStyle':''"><img
								src="../assets/img/stamen-map.png">
							<div class="on">Stamen</div>
						</li>
						<li @click="MapChangeType('3')" :class="active[2]?'activeStyle':''"><img
								src="../assets/img/google-map.png">
							<div class="on">Google</div>
						</li>

					</div>
				</div>
				<div class="map0"> <i class="el-icon-picture-outline-round"></i></div>
			</el-tooltip>
		</div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import XYZ from 'ol/source/XYZ';
	import Stamen from 'ol/source/Stamen';
	import 'ol-popup/src/ol-popup.css';
	import Popup from 'ol-popup';
	import 'ol-geocoder/dist/ol-geocoder.css';
	import Geocoder from 'ol-geocoder';
	import * as control from 'ol/control'
	import {Attribution,MousePosition,ScaleLine,defaults as defaultControls} from "ol/control";
	import {format} from "ol/coordinate";
	import MeasureTool from "@/assets/js/measure.js"
	export default {
		name: 'Mapbox',
		data() {
			return {
				map: null,
				zoomValue: 4,
				arcLayer: null,
				googleLayer: null,
				stamenLayer: null,
				active: [true, false, false]
			}
		},
		methods: {
			MapChangeType(x) {
			 switch (x) {
					case '1':
						this.arcLayer.setVisible(true);
						this.stamenLayer.setVisible(false);
						this.googleLayer.setVisible(false);
						this.active = [true, false, false]
						break;
					case '2':
						this.arcLayer.setVisible(false);
						this.stamenLayer.setVisible(true);
						this.googleLayer.setVisible(false);
						this.active = [false, true, false]
						break;
					case '3':
						this.arcLayer.setVisible(false);
						this.stamenLayer.setVisible(false);
						this.googleLayer.setVisible(true);
						this.active = [false, false, true]
						break;
				}
			},

			addScaleLine() {
				let mycontrol = new ScaleLine({
					units: 'metric',
					//单位包括：degrees：度数；imperial：imperial inch；us：us incn；nautical：nautical mile；metric：千米
					bar: true, //如果为false，则为线的形式
					text: true, //bar 为true时候管用
					steps: 4,
					minWidth: 100,
					maxWidth: 300,
				})
				this.map.addControl(mycontrol)
			},

			// 测量功能
			getLength(x) {
				this.clear()
				MeasureTool.measure(this.map, x, true);
			},
			getArea(x) {
				this.clear()
				MeasureTool.measure(this.map, x, true);
			},
			clear() { //清除图层，中间参数为空
				MeasureTool.measure(this.map, "", false);
			},

			// 搜索功能
			addSearch() {
				const popup = new Popup();
				const geocoder = new Geocoder('nominatim', {
					provider: 'photon',
					targetType: 'glass-button',
					lang: 'en',
					placeholder: 'Search for ...',
					limit: 5,
					keepOpen: false,
				});
				this.map.addControl(geocoder);
				this.map.addOverlay(popup);
				// Listen when an address is chosen
				geocoder.on('addresschosen', (evt) => {
					window.setTimeout(() => {
						popup.show(evt.coordinate, evt.address.formatted);
					}, 3000);
				});
			},

			addFullScreen() {
				let mycontrol = new control.FullScreen({
					tipLabel: "全屏显示", //全屏提示文字								
				})
				this.map.addControl(mycontrol)
			},

			// 控制Zoom
			getZoom() {
				this.map.on('moveend', (e) => {
					let czoom = this.map.getView().getZoom();
					this.zoomValue = Math.floor(czoom);
				})
			},
			zoomin() {
				let czoom = this.map.getView().getZoom();
				this.map.getView().setZoom(czoom + 1)
			},
			zoomout() {
				let czoom = this.map.getView().getZoom();
				this.map.getView().setZoom(czoom - 1)
			},
			addMousePosition() {
				let mousePositionControl = new MousePosition({
					coordinateFormat: (coordinate) => {
						return format(coordinate, "经度:{x}     纬度:{y}", 2);
					},
					projection: "EPSG:4326",
					target: 'mouse',
					placeholder: '请在地图上移动鼠标', //鼠标不在viewport时候显示的内容  
				});
				this.map.addControl(mousePositionControl)
			},
			addAttribution() {
				let myControl = new Attribution({
					collapsible: true, //加载时是确定属性是否可折叠
					collapsed: true, //加载时是否已折叠
					label: "C", //折叠按钮的文字信息
					tipLabel: '版权信息', //折叠按钮的提示信息
					collapseLabel: '>' //未折叠时的收起按钮
				});
				this.map.addControl(myControl)
			},

			// 初始化地图	
			initMap() {
				let copyrightInfo =
					'<a href="https://dajianshi.blog.csdn.net/" target="_blank">&copy; 还是大剑师兰特博客</a> '
				this.arcLayer = new TileLayer({
					source: new XYZ({
						url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
						attributions: copyrightInfo,
					}),

					visible: true,
				});
				this.stamenLayer = new TileLayer({
					source: new Stamen({
						layer: 'terrain'
					}),
					visible: false,
				});
				this.googleLayer = new TileLayer({ //谷歌影像图
					visible: false,
					name: 'googleSLayer',
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m@189&hl=en&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous",
						attributions: copyrightInfo,
					})
				});

				this.map = new Map({
					layers: [
						this.arcLayer,
						this.stamenLayer,
						this.googleLayer
					],
					target: 'vue-openlayers',
					view: new View({
						center: [13247019.404399557, 4721671.572580107],
						projection: "EPSG:3857",
						zoom: 4,
					}),
					controls: control.defaults({
						zoom: false,
						attribution: false,
					}).extend([
						// new control.FullScreen() //另外一种方式
					]),
				});
			},
		},
		mounted() {
			this.initMap();
			this.addSearch();
			this.addFullScreen();
			this.getZoom();
			this.addMousePosition();
			this.addAttribution();
			this.addScaleLine()
		},
	}
</script>
<style scoped>
	.container {width: 1000px;height: 640px;margin: 0 auto;border: 1px solid #42B983;}
	#vue-openlayers {width: 960px;height: 520px;margin: 0 auto;border: 1px solid #42B983;position: relative;}
	.zoomin,.zoomout,.zoomvalue,.measureLength,.measureArea,.clear,.map0 {width: 30px;height: 30px;line-height: 30px;text-align: center;background: rgba(0, 0, 0, 0.6);font-size: 20px;position: absolute;z-index: 2;border: 1px solid #000088;color: #fff;cursor: pointer;}
	.zoomout {bottom: 50px;right: 10px;}
	.zoomvalue {bottom: 80px;right: 10px;}
	.zoomin {bottom: 110px;right: 10px;}
	.measureLength {bottom: 150px;right: 10px;}
	.measureArea {bottom: 180px;right: 10px;}
	.clear {bottom: 210px;right: 10px;}
	.map0 {bottom: 260px;right: 10px;}
	#mouse {position: absolute;top: 10px;left: 10px;z-index: 10;width: 160px;height: 30px;line-height: 20px;font-size: 14px;color: #fff;background: rgba(0, 0, 0, 0.6);}
	.mapbox {width: 330px;height: 60px;display: flex;flex-wrap: nowrap;justify-content: space-between;}
	.mapbox li {width: 100px;height: 50px;margin: 5px 0;display: block;position: relative;cursor: pointer;}
	.mapbox li .on {height: 16px;width: 100px;background-color: rgba(0, 0, 0, 0.3);color: #fff;font-size: 12px;position: absolute;bottom: 0;left: 0;display: none;text-align: center;}
	.mapbox li:hover .on {display: block;}
	.activeStyle {width: 100px;height: 50px;border: 1px solid #f00;}
	.ol-control button {width: 30px;height: 30px;cursor: pointer;background: rgba(0, 0, 0, 0.6);}
	.gcd-gl-btn::after {content: 'S';width: 26px;height: 26px;position: absolute;color: #fff;text-align: center;line-height: 26px;left: 0;top: 0;}

</style>

