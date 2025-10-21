
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-07-01
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 显示轨迹并计算流速</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="show(datas)">显示并计算</el-button>
			<el-button type="danger" size="mini" @click="cancel()">取消</el-button>
			<span>
				总长：{{L}} 千米，用时:{{T}} 小时, 流速：{{S}} 千米/小时
			</span>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Icon from 'ol/style/Icon'
	import Feature from 'ol/Feature'
	import {Point,LineString} from "ol/geom";
	import {toLonLat,fromLonLat} from 'ol/proj'
	import * as turf from '@turf/turf'
	import dayjs from "dayjs";
	
	export default {
		data() {
			return {
				map: null,
				L:0,
				T:0,
				S:0,
				trackSource: new VectorSource({wrapX: false}),
				datas: [{
						"time": "2024-06-24 00:05:40",
						"lon": 168.3457792,
						"lat": 35.336976
					},
					{
						"time": "2024-06-24 01:07:40",
						"lon": 168.3622016,
						"lat": 35.3770496
					},	
					{
						"time": "2024-06-24 05:13:30",
						"lon": 168.441344,
						"lat": 35.3953216
					},

					{
						"time": "2024-06-24 06:15:00",
						"lon": 168.4677376,
						"lat": 35.4096416
					}
				],

			}
		},

		methods: {
			cancel(){
				this.S=0;this.T=0;this.L=0;
				this.trackSource.clear();
			},
			show(data) {
					let goodData = data.filter((item) => {								
						if( item.lat>-90 && item.lat<90 && item.lon>-180 && item.lon<180){
							return item
						}						
					})
					let calcData = goodData.map((item) => {
							return [item.lon,item.lat]											
					})

					// 计算长度
					let line = turf.lineString(calcData);
					this.L = turf.length(line, { units: "kilometers" }).toFixed(2);
					//计算时间
					let t1= dayjs(goodData[0].time).unix()
					let t2= dayjs(goodData[goodData.length-1].time).unix()
					this.T=((t2-t1)/3600).toFixed(2)
					//计算速度
					this.S= (this.L/this.T).toFixed(2)
					
					// 线的渲染
					let lineData = goodData.map((item) => {
						return fromLonLat([item.lon, item.lat])					
					})

					let LineStringFeature = new Feature(
						        new LineString(lineData)
								);
					LineStringFeature.setStyle(new Style({
						stroke: new Stroke({
							color: '#f00',
							width: 2
						})
					}))
					this.trackSource.addFeature(LineStringFeature);


                    // 点的渲染
					let pointFeatures = []
					let img = ''
					for (let i = 0; i < goodData.length; i++) {
						if (i == 0) {
							img = require('@/assets/startPoint.png')
						} else if (i == goodData.length - 1) {
							img = require('@/assets/endPoint.png')
						} else {
							img = require('@/assets/point.png')
						}

						let feature = new Feature({
							geometry: new Point(fromLonLat([goodData[i].lon, goodData[i].lat])),

						})

						feature.setStyle(this.setTrackStyle(goodData[i].time, img,i)) 
						pointFeatures.push(feature)
					}

					this.trackSource.addFeatures(pointFeatures);

			},
			
			setTrackStyle(text, img, i) {
				let Styles = [];
				Styles.push(
					new Style({
						image: new Icon({
							src: img,
							anchor: [0.5, 0.5],
							scale: 1,
						}),			
					})
				)
				return Styles
			},

			initMap() {
               let googlelayer = new Tile({
               source: new XYZ({
               		url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                  	})
               });
			   
			   let trackLayer = new VectorLayer({ //轨迹层
			   	source: this.trackSource,
			   });

				this.map = new Map({
					target: "vue-openlayers",
					layers: [googlelayer,trackLayer],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([168.4677376, 35.4096416]),
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
		width: 1000px;
		height: 660px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 960px;
		height: 490px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

