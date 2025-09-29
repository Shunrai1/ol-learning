
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-09-30
*/

<template>
	<div class="container">
		<h3>vue+openlayers：右键点击定位，获取某一点下多层features信息 </h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="info" size="mini" @click="showPolygon(city1)">显示多边形1</el-button>
			<el-button type="info" size="mini" @click="showPolygon(city2)">显示多边形2</el-button>
			<el-button type="danger" size="mini" @click="clearLayer()">清除图层</el-button>
		</h4>
		<div id="vue-openlayers"></div>
		<div id="popup-box" class="ol-popup">
			<div id="popup-content" v-if="isshow==1">
				<div class="left"><img :src="cimgurl"></div>
				<div class="right">
					<div class="name">{{cname}}</div>
					<div class="address">{{caddress}}</div>
				</div>
			</div>
			<div id="popup-content2" v-if="isshow==2">
                  <div v-for="(item,index) in list" :key='index'>{{ index+1 }} ：{{ item }}</div>
			</div>
			
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
	import Overlay from 'ol/Overlay';

	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
				list:[],
				isshow:0,
                cimgurl:'',
				cname:'',
				caddress:'',
				city1: {
					name: 'PP汽车',
					address: "长治市XX豪车路48号",
					polygonData: [
						[
							[126.86864, 24.99068],
							[126.55518, 16.27420],
							[148.85507, 16.49975],
							[148.93343, 24.84854],
							[126.86864, 24.99068]
						]
					],
					imgurl: require('@/assets/img/car.png')
				},
				city2: {
					name: '星空火箭公司',
					polygonData: [
						[
							[121.61820, 24.56377],
							[121.53983, 15.89772],
							[136.89934, 15.82234],
							[136.66425, 24.27836],
							[121.61820, 24.56377]
						]
					],
					address: "太原市XXX科技路96号",
					imgurl: require('@/assets/img/rocket.png')
				},


			};
		},

		methods: {


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

				    this.map.getViewport().addEventListener('contextmenu', (evt) => {
				       evt.preventDefault() //去掉原始右键菜单	
								   
                      var coordinate = this.map.getEventCoordinate(evt)
					  let pixel = this.map.getPixelFromCoordinate(coordinate)
					  // const pixel = this.map.getEventPixel(evt.originalEvent);//右键使用getEventPixel报错
					  let feas=this.map.getFeaturesAtPixel(pixel) //Get all features that intersect a pixel on the viewport.

					   if (feas&&feas.length==1) {
						   this.isshow=1;
							let cityInfo = feas[0].get('infoData')
							this.cname = cityInfo.name;
							this.cimgurl = cityInfo.imgurl;
							this.caddress = cityInfo.address;
							this.overlayer.setPosition(coordinate);
						} else if(feas&&feas.length>1){
							this.list=JSON.parse(JSON.stringify([]));
							 this.isshow=2;
							for(let i=0;i<feas.length;i++){
								let cityInfo = feas[i].get('infoData')
								this.list.push(cityInfo.name)
							}
							this.overlayer.setPosition(coordinate);
						}else{
							this.isshow=0;
							this.overlayer.setPosition(undefined);
						}				  
					
				});
			},

			// 设置vector样式
			featureStyle() {
				let style = new Style({
					fill: new Fill({
						color: "rgba(0,0,0,0.1)"
					}),
					stroke: new Stroke({
						width: 1,
						color: "blue",
					}),
				})
				return style
			},
			// 清除vector数据源
			clearLayer() {
				this.dataSource.clear();
			},

			showPolygon(data) {
				let polygonFeature = new Feature({
					geometry: new Polygon(data.polygonData),
					infoData:data,
				})
				this.dataSource.addFeature(polygonFeature)
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
						projection: "EPSG:4326",
						center: [121.61820, 24.56377],
						zoom: 4
					}),
				})

			},
		},
		mounted() {
			this.initMap();
			this.clickPoint() 
			// this.featureClick()
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

	.ol-popup {
		position: absolute;
		background-color: rgba(146, 55, 125, 0.8);
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
		border-top-color: rgba(146, 55, 125, 0.8);
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

	#popup-content2 {
		min-width: 270px;
		min-height: 40px;
		padding: 20px;
		border-radius: 10px;
		border: 1px solid #fff;
	}

	#popup-content {
		width: 270px;
		height: 80px;
		border-radius: 10px;
		border: 1px solid #fff;
	}

	#popup-content .left {
		width: 80px;
		height: 80px;
		float: left;
	}

	#popup-content .left img {
		width: 80px;
		height: 80px;
	}

	#popup-content .right {
		width: 170px;
		height: 80px;
		float: right;
		text-align: left;
	}

	#popup-content .right .name {
		line-height: 40px;
		font-size: 18px;
	}

	#popup-content .right .address {
		line-height: 40px;
		font-size: 12px;
	}
</style>


