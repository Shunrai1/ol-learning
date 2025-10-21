/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-07-31
*/

<template>
	<div class="container">
		<h3>vue+Openlayers：绘制点，导出CSV文件</h3>
		<p>大剑师兰特,还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="drawPoint()">绘制点</el-button>
			<el-button type="danger" size="mini" @click="clearDraw()">清除图形</el-button>
			<el-button type="success" size="mini" @click="exportCSV()">导出CSV</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from "ol";
	import XYZ from "ol/source/XYZ";
	import TileLayer from "ol/layer/Tile"
	import Feature from 'ol/Feature'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Draw from 'ol/interaction/Draw'
	import {fromLonLat} from 'ol/proj'
	import GeoJSON from 'ol/format/GeoJSON'
	import Papa from 'papaparse/papaparse.min.js' //处理csv
	const FileSaver = require('file-saver');
	
	export default {
		name: "exportKML",
		data() {
			return {
				map: null,
				XYZLayer: null,
				draw: null,
				source: new SourceVector({
					wrapX: false,
					useSpatialIndex: false,
					// features: []
				}),
			}
		},
		mounted() {
			this.initMap();
		},
		methods: {
			exportCSV() {
	            let temp=this.source.getFeatures();
				let features = new GeoJSON().writeFeaturesObject(temp,{
					dataProjection:'EPSG:4326',
					featureProjection:'EPSG:3857'
				}).features;
				console.log(features)
				var csv = [];
				var header = {};
				var n = 0;
			 var isPt = true;
				features.forEach(function(f) {
					if (f && f.geometry) {
						for (var p in f.properties) {
							if (header[p] === undefined) {
								header[p] = n++;
							}
						}
			 		if (f.geometry.type !== 'Point') isPt = false;
					}
				});
				
				features.forEach(function(f) {
					if (f && f.geometry) {
						var row = [];
						for (var p in header) {
							var r = row[header[p]] = f.properties[p];
							if (String(r) === '[object Object]') row[header[p]] = JSON.stringify(f.properties[p])
						}

						if (isPt) {
							row.push(f.geometry.coordinates[0]);
							row.push(f.geometry.coordinates[1]);
						} else {
							row.push(f.geometry.type);
							row.push(JSON.stringify(f.geometry.coordinates));
						}
						csv.push(row);
					}
				});
				var cols = []
				for (var p in header) {
					cols.push(p);
				}
				if (isPt) {
					cols.push('lon');
					cols.push('lat');
				} else {
					cols.push('type');
					cols.push('coord');
				}
				csv.unshift(cols);
				console.log(csv)
				let result = Papa.unparse(csv);

				const blob = new Blob([result], {
				    type: 'text/plain;charset=utf-8'
				});
				FileSaver.saveAs(blob, 'mydata.csv');

				console.log(result)
			},

			clearDraw() {
				this.source.clear()
			},
			drawPoint() {
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}
				let type = 'Point'
				this.draw = new Draw({
					source: this.source,
					type: type,
					style: new Style({
						fill: new Fill({
							color: '#fff'
						}),
						stroke: new Stroke({
							width: 2,
							color: "red",
						}),
					}),
				})
				this.map.addInteraction(this.draw)
				// this.draw.on('drawend', (e) => {
				// 	this.map.removeInteraction(this.draw)
				// })
			},

			initMap() {
				this.XYZLayer = new TileLayer({
					source: new XYZ({
						url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
					})
				})

				let vector = new LayerVector({
					source: this.source,
					style: new Style({
						fill: new Fill({
							color: 'transparent'
						}),
						stroke: new Stroke({
							width: 2,
							color: "red",
						}),
						  image: new Circle({  //点样式
								radius: 5, 
								fill: new Fill({
								  color: '#f0f'
								})
							  }),
					})

				});
				this.map = new Map({
					layers: [this.XYZLayer, vector],
					view: new View({
						center: fromLonLat([-116, -39.5]),
						zoom: 3,
						projection: 'EPSG:3857',
					}),
					target: 'vue-openlayers'
				})
			}
		},

	}
</script>
<style scoped>
	.container {
		width: 1000px;
		height: 640px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


