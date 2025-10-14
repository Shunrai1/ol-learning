/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-12-12
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 上传GeoJSON文件，展示图形，导出CSV格式文件</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<input style="margin-top: 16px" type="file" id="fileselect" accept=".geojson" />
			<el-button type="primary" size="mini" @click='exportCSV()'> 导出CSV</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import {Tile} from 'ol/layer';
	import OSM from 'ol/source/OSM'
	import {fromLonLat} from 'ol/proj'
	import GeoJSON from 'ol/format/GeoJSON'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Text from 'ol/style/Text'
	import Icon from 'ol/style/Icon'
	import Papa from 'papaparse/papaparse.min.js' //处理csv
	const FileSaver = require('file-saver');

	export default {
		name: 'CSVJSON',
		data() {
			return {
				map: null,
				source: new SourceVector({
					wrapX: false,
					format: new GeoJSON({}),
				}),
				feas: [],
			}
		},
		methods: {
			exportCSV() {
				let features = this.feas;
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
						console.log(f.getGeometry)
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
			readFile() {
				this.source.clear();//清除原矢量数据
				let fileselect = document.querySelector('#fileselect')
				fileselect.addEventListener('change', function(e) {
					let files = e.target.files;
					let filetype = files[0].name.split('.')[1]
					console.log('文件类型' + filetype)
					if (files.length === 0) {
						alert("没有数据，请重新上传新文件！")
						return
					}
					let reader = new FileReader()
					reader.readAsText(files[0])
					let that = this;
					reader.onload = function(evt) {
						let csvFeatures = JSON.parse(reader.result).features;
						that.feas = csvFeatures;
						//以上部分生成features用于导出csv， 以下部分用于展示geojson图形

						let shpArray = evt.target.result;
						let allFeatures = that.source.getFormat().readFeatures(shpArray, {
							dataProjection: 'EPSG:4326',
							featureProjection: 'EPSG:3857'
						});
						that.source.addFeatures(allFeatures);
						that.source.forEachFeature(function(feature) {
							let style = new Style({
								fill: new Fill({
									color: 'orange'
								}),
								stroke: new Stroke({
									color: 'blue'
								}),
								text: new Text({
									text: feature.get('name'),
									font: '12px Calibri,sans-serif',
									fill: new Fill({
										color: '#000'
									}),
									stroke: new Stroke({
										color: '#fff',
										width: 2
									})
								})
							});
							feature.setStyle(style);
						});
					}

				}.bind(this))
			},

			initMap() {

				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new OSM()
						}),
						new LayerVector({
							source: this.source,
						})
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-36.77542, -37.56855]),
						zoom: 2,
					})
				})

			}
		},
		mounted() {
			this.initMap()
			this.readFile()
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
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


