
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-12-08
*/

<template>
	<div class="container">
		<h3>vue+openlayers:轨迹动画，走过后轨道呈现不同颜色</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="start()">开始</el-button>
			<el-button type="info" size="mini" @click="pause()">暂停</el-button>
			<el-button type="danger" size="mini" @click="end()">结束</el-button>

		</h4>
		<div id="vue-openlayers"></div>
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
	import Icon from 'ol/style/Icon'	
	import Stroke from 'ol/style/Stroke'
	import CircleStyle from 'ol/style/Circle'

	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
				passSource: new VectorSource({
					wrapX: false
				}),
				lineData: [
					[116, 39],
					[116.055, 38.956],
					[116.105, 39.015],
					[116.166, 38.948],
					[116.200, 39.005]
				],
				lineFeature:null,
				pointFeature:null,
				step1: 0,
				requestID:null,
			};
		},

		methods: {
            start(){				
				this.animation(this.step1)
			},
			pause(){
				cancelAnimationFrame(this.requestID)
			},
			end(){
				this.step1=0;
				this.passSource.clear();//清除划过的轨迹
				cancelAnimationFrame(this.requestID)
                this.pointFeature.getGeometry().setCoordinates(this.lineFeature.getGeometry().getCoordinateAt(this.step1))
			},

			featureStyle() {
				let style = new Style({
					fill: new Fill({
						color: "#f0f"
					}),
					stroke: new Stroke({
						width: 2,
						color: "#f0f",
					}),
				})
				return style
			},

			showTrack() {
				this.lineFeature = new Feature({
					geometry: new LineString(this.lineData),
				})
				this.dataSource.addFeature(this.lineFeature)
				this.pointFeature = new Feature({
					geometry: new Point([116, 39]),
				})
				this.pointFeature.setStyle(
				        new Style({
				          image: new Icon({
				            src: require('@/assets/img/car-track.png'),
				            rotateWithView: true,
				            scale: 0.8
				          }),
				          zIndex: 1000
				        })
				      )
				this.dataSource.addFeature(this.pointFeature)
			},

             animation(step) {
			           this.requestID = window.requestAnimationFrame(()=> {
			             if (step <= 1) {
			               var second = this.lineFeature.getGeometry().getCoordinateAt(step)
			               var first = this.pointFeature.getGeometry().getCoordinates()
			               var angle = -Math.atan2(second[1] - first[1], second[0] - first[0])
			               this.pointFeature.getGeometry().setCoordinates(this.lineFeature.getGeometry().getCoordinateAt(step))
			               this.pointFeature.getStyle().getImage().setRotation(angle)   

			               let coord = []
			               coord.push(first)
			               coord.push(second)
			               var Tempfeature = new Feature({
			                 geometry: new LineString(coord)
			               })
			               this.passSource.addFeature(Tempfeature)
			               step = step + 0.0005
						   this.step1=step
			               this.animation(this.step1)
			             } else {
			               var second = this.lineFeature.getGeometry().getCoordinateAt(1)
			               var first = this.pointFeature.getGeometry().getCoordinates()
			               var angle = -Math.atan2(second[1] - first[1], second[0] - first[0])
			               this.pointFeature.getGeometry().setCoordinates(second)
			               this.pointFeature.getStyle().getImage().setRotation(angle)
			               let coord = []
			               coord.push(first)
			               coord.push(second)
			               var Tempfeature = new Feature({
			                 geometry: new LineString(coord)
			               })
			               this.passSource.addFeature(Tempfeature)
			             }
			           }, 1)

		   },


			// 初始化地图     
			initMap() {
				let mapLayer = new TileLayer({
					 source: new OSM()
				})
				let featureLayer = new VectorLayer({
					source: this.dataSource,
					style: this.featureStyle() //统一设置vector样式
				})
				let passLayer = new VectorLayer({
					source: this.passSource,
					style: new Style({
						fill: new Fill({
							color: "blue"
						}),
						stroke: new Stroke({
							width: 2,
							color: "blue",
						}),
					})
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						mapLayer,
						featureLayer,
						passLayer
					],
					view: new View({
						projection: "EPSG:4326",
						center: [116.105, 39],
						zoom: 12
					}),
				})

				this.showTrack(); //显示小汽车轨迹
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
</style>

 
