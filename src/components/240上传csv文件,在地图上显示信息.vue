

/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-06-05
*/

<template>
	<div class="container">
		        <h3>vue+openlayers: 上传CSV文件，在地图显示，点击显示点信息</h3>
		        <p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<input style="margin-top: 16px" type="file" id="fileselect" accept=".csv" />
		</h4>
		<div id="vue-openlayers"></div>
		<div id="popup-box" class="ol-popup">
			<div id="popup-content">
				<div class="oneline">经度：{{lon}}</div>
				<div class="oneline">纬度：{{lat}}</div>
			</div>
		</div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import Map from 'ol/Map'
	import View from 'ol/View'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import Tile from 'ol/layer/Tile';
	import XYZ from 'ol/source/XYZ'
	import Feature from 'ol/Feature'
	import Overlay from 'ol/Overlay';
	import Point from "ol/geom/Point"
	import LineString from "ol/geom/LineString"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import CircleStyle from 'ol/style/Circle'
	import {fromLonLat} from 'ol/proj'
	import GeoJSON from 'ol/format/GeoJSON'
	import Papa from 'papaparse/papaparse.min.js' 
	export default {
		name: 'CSVJSON',
		data() {
			return {
				map: null,
				source: new SourceVector({
					wrapX: false,
					format: new GeoJSON({}),
				}),
				fileName: '',
				lat: '',
				lon: '',
			}
		},
		methods: {
			// 设置点的大小样式
			featureStyle() {
				let style = new Style({
					fill: new Fill({
						color: "#00f"
					}),
					stroke: new Stroke({
						width: 3,
						color: "#00f",
					}),
					image: new CircleStyle({ //点样式
						radius: 6,
						fill: new Fill({
							color: '#ff00ff'
						})
					}),
				})
				return style
			},

			// 点击点出现弹出信息
			clickPoint() {
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
				this.map.on('click', (e) => {
					let feature = this.map.forEachFeatureAtPixel(
						e.pixel,
						(feature, layer) => {
							return feature
						}
					)
					if (feature&&feature.getGeometry().getType()=='Point') {
						let pointInfo = feature.get('pointdata')
						_that.lon = pointInfo.jd;
						_that.lat = pointInfo.wd;
						_that.overlayer.setPosition(e.coordinate);
					} else {
						_that.overlayer.setPosition(undefined);
					}
				});
			},

		 // 上传文件并在地图展示信息
			readAndShowPoints() {
				this.result = JSON.parse(JSON.stringify(null));
				let fileselect = document.querySelector('#fileselect')
				fileselect.addEventListener('change', (e) => {
					let files = e.target.files;
					if (files.length === 0) {
						alert("没有数据，请重新上传新文件！")
						return
					}
					let file = files[0];
					this.fileName = file.name.split('.').slice(0, -1).join('.');

					Papa.parse(file, {
						header: true,
						complete: (results) => {
							let arr = results.data;
							let features = [];
							let lineArr = [];
							for (let i = 0; i < arr.length-1; i++) {
								lineArr.push([Number(arr[i].jd), Number(arr[i].wd)])
								let feature = new Feature({
									geometry: new Point([arr[i].jd, arr[i].wd]),
									pointdata: arr[i],
								})
								feature.setStyle(this.featureStyle())
								features.push(feature)
							}
							console.log(lineArr)
							this.source.addFeatures(features)
							// 画线                      
							let lineFeature = new Feature({
								geometry: new LineString(lineArr),
								type: 'lineString', 
							})						
							lineFeature.setStyle(this.featureStyle())
							this.source.addFeature(lineFeature)

						}
					});

				})
			},

			// 初始化地图
			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({ //加载谷歌地图
							source: new XYZ({
								url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
								crossOrigin: "anonymous"
							})
						}),
						new LayerVector({ //加载csv信息层
							source: this.source,
						})
					],
					view: new View({
						projection: "EPSG:4326",
						center: [-111.0621,53.08104],
						zoom: 7,
					})
				})
				this.clickPoint()
			}
		},
		mounted() {
			this.initMap()
			this.readAndShowPoints()
		}
	}
</script>

<style scoped>
    .container {
        width: 840px;
        height: 580px;
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
		padding: 5px;
		bottom: 12px;
		left: -50px;
		min-width: 120px;
	}

	#popup-content {
		width: 120px;
		height: 40px;
		background-color: aquamarine;
		padding: 10px;
	}

	#popup-content .oneline {
		line-height: 20px;
		font-size: 13px;
	}
</style>

