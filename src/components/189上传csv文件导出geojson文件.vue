
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
		<h3>vue+openlayers: 上传CSV文件，导出Geojson格式文件</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<input style="margin-top: 16px" type="file" id="fileselect" accept=".csv" />
			<el-button type="primary" size="mini" @click='exportGeojson()'> 导出Geojson</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import Map from 'ol/Map'
	import View from 'ol/View'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import Tile from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM'
	import {fromLonLat} from 'ol/proj'
	import GeoJSON from 'ol/format/GeoJSON'
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
				result: null,
				fileName: '',
			}
		},
		methods: {
			exportGeojson() {

				let json = {
					type: 'FeatureCollection',
					features: []
				};

				this.result.data.forEach(function(d) {
					let f = {
						type: 'Feature',
						properties: JSON.parse(JSON.stringify(d))
					}
					if (d.hasOwnProperty("lon")) {
						console.log(f.properties)
						delete f.properties.lon;
						delete f.properties.lat;
						f.geometry = {
							type: 'Point',
							coordinates: [parseFloat(d.lon), parseFloat(d.lat)]
						};
					} else {
						console.log(f.properties)
						delete f.properties.type;
						delete f.properties['coord'];
						f.geometry = {
							type: d.type,
							coordinates: JSON.parse(d.coord)
						};
					}
					json.features.push(f);
				});

				console.log(json)
				let res = JSON.stringify(json, null, ' ');
				const blob = new Blob([res], {
					type: 'text/plain;charset=utf-8'
				});
				FileSaver.saveAs(blob, this.fileName + '.geojson');
			},
			readFile() {
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
							this.result = results;
						}
					});

				})
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


