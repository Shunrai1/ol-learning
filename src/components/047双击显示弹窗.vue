/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-12
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 双击鼠标显示品牌代言人名片</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>

		<div id="popup-box" class="ol-popup">
			<div id="popup-content">
				<div class="left"><img :src="imgurl" ></div>
				<div class="right">
					<div class="name">{{name}}</div>
					<div class="dec">{{phone}}</div>
					<div class="dec">{{email}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import Overlay from 'ol/Overlay';
	import {fromLonLat,toLonLat,transform} from "ol/proj";
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import Text from 'ol/style/Text'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Feature from 'ol/Feature'
	import {Point} from "ol/geom"
	import * as Interaction from 'ol/interaction';

	export default {
		data() {
			return {
				map: null,
				overlayer: null,
				vsource: new VectorSource({}),
				imgurl:null,
				name:'',
				email:'',
				phone:'',
				citys: [{
						name: '阿米尔·汗',
						position: [73, 19],
						phone: "138****8888",
						email: 'amh@lante.info',
						imgurl: require('@/assets/img/person1.png')
					},
					{
						name: '艾西瓦娅·雷',
						position: [77, 28],
						phone: "138****6666",
						email: 'axwy@lante.info',
						imgurl: require('@/assets/img/person2.png')
					},

				]
			}
		},
		methods: {
			// 城市点层	
			companyPoint() {
				let features = [];
				let data = this.citys;
				for (var i = 0; i < data.length; i++) {
					let feature = new Feature({
						geometry: new Point(data[i].position),
						persondata: data[i],
					})
					let img=data[i].imgurl;
					feature.setStyle(this.pointStyle(img))
					features.push(feature)
				}
				this.vsource.addFeatures(features)
			},
			// 点的样式
			pointStyle(img) {
				let Styles = []
				Styles.push(
					new Style({
						// 设置图标
						image: new Icon({
							src: img,
							anchor: [0.5, 0.5],
							scale: 0.4,
						}),
					})
				)
				return Styles
			},
			// hover显示城市信息	
			clickPoint() {
				// 设置浮层
				const box = document.getElementById('popup-box');
				this.overlayer = new Overlay({
					element: box,
					autoPan: {
						animation: {
							duration: 250,
						},
					},
				});
				this.map.addOverlay(this.overlayer);

				// 显示内容
				let _that = this;
				this.map.on('dblclick', (e) => {
					let feature = this.map.forEachFeatureAtPixel(
						e.pixel,
						(feature, layer) => {
							return feature
						}
					)
					if (feature) {
						let person = feature.get('persondata')
						_that.name = person.name;
						_that.imgurl = person.imgurl;
						_that.phone = person.phone;
						_that.email = person.email;
						_that.overlayer.setPosition(e.coordinate);
					} else {
						_that.overlayer.setPosition(undefined);
					}
				});
			},
       // 初始化地图
			initMap() {
				let osmLayer = new Tile({
					source: new OSM(),
				});
				let cityLayer = new VectorLayer({
					source: this.vsource,
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						osmLayer,
						cityLayer
					],
					view: new View({
						center: [77, 28],
						zoom: 5,
						projection: 'EPSG:4326'
					}),
					interactions:new Interaction.defaults({
					 doubleClickZoom:false,   //屏蔽双击放大事件
					})

				});
                this.clickPoint();

			},
		},
		mounted() {
			this.initMap();
			this.companyPoint();
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
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

	.ol-popup {
		position: absolute;
		background-color: rgba(	210,105,30, 0.8);
		padding: 5px;
		border-radius: 5px;
		border: 1px solid #cccccc;
		bottom: 12px;
		left: -50px;
		color: #FFFFFF;
		min-width: 200px;
	}

	.ol-popup:after,
	.ol-popup:before {
		top: 100%;
		border: solid transparent;
		content: " ";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
	}

	.ol-popup:after {
		border-top-color: rgba(	210,105,30, 0.8);
		border-width: 10px;
		left: 48px;
		margin-left: -10px;
	}

	.ol-popup:before {
		border-top-color: #cccccc;
		border-width: 11px;
		left: 48px;
		margin-left: -11px;
	}
    #popup-content{ width: 270px; height: 120px; border-radius: 10px; }
	#popup-content .left{ width: 100px; height: 120px; float: right;}
	#popup-content .left img { width: 100px; height: 120px;}
	#popup-content .right{ width: 160px; height: 120px; float: left; text-align: left;padding-left: 10px;}
	#popup-content .right .name{line-height: 50px; font-size: 20px;}
    #popup-content .right .dec{line-height: 30px; font-size: 14px;}
</style>

