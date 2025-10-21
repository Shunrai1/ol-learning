
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-07-02
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 显示流动轨迹并计算航向</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="show(data1)">数据1</el-button>
			<el-button type="primary" size="mini" @click="show(data2)">数据2</el-button>
			<el-button type="primary" size="mini" @click="show(data3)">数据3</el-button>
			<el-button type="primary" size="mini" @click="show(data4)">数据4</el-button>
			<el-button type="danger" size="mini" @click="cancel()">取消</el-button>
			<span>
				航向：{{D}}
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
				D:'',
				trackSource: new VectorSource({wrapX: false}),
				data1: [{
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
					}
				],
				data2: [{
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
						"lon": 168.321344,
						"lat": 35.3953216
					}
				],
				data3: [{
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
						"lon": 168.3457792,
						"lat": 35.3953216
					}
				],
				data4: [{
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
						"lon": 168.321344,
						"lat": 35.236976
					}
				],
			}
		},

		methods: {
			// 弧度变更为角度
			radiansToDegrees(radians) {
			    const degrees = radians % (2 * Math.PI);
			    return (degrees * 180 / Math.PI).toFixed(2);
			},
			
			 //计算两点对于正北方向的朝向角度 [-180~180]
			bearing(start, end) {
				let rad = Math.PI / 180,
			      	lat1 = start[1] * rad,
			      	lat2 = end[1] * rad,
			      	lon1 = start[0]  * rad,
			      	lon2 = end[0] * rad;
			    const a = Math.sin(lon2 - lon1) * Math.cos(lat2);
			    const b = Math.cos(lat1) * Math.sin(lat2) -
			        	  Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);			
			   let v = this.radiansToDegrees(Math.atan2(a, b));
			   if(v==0){ 
				   this.D='正北'
				}else if(v>0 && v<90){
					this.D=`北偏东${v}度`
				}else if(v==90){
					this.D=`正东`
				}else if(v>90 && v<180){
					this.D=`北偏东${v}度`
				}else if(v==180){
					this.D=`正南`
				}else if(v>-180 && v<-90){
					let d=Math.abs(v)
					this.D=`北偏西${d}度`
				}else if(v==-90){
					this.D=`正西`
				}else{
					let d=Math.abs(v)
					this.D=`北偏西${d}度`
				}								
			},

			cancel(){
				this.D='';
				this.trackSource.clear();
			},
			show(data) {
				   this.cancel();
					let goodData = data.filter((item) => {								
						if( item.lat>-90 && item.lat<90 && item.lon>-180 && item.lon<180){
							return item
						}						
					})
					let calcData = goodData.map((item) => {
							return [item.lon,item.lat]											
					})

                   this.bearing(calcData[0],calcData[calcData.length-1])

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


