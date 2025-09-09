/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-01
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 上传解析文件显示图形，支持.geojson .kml .shp格式</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<input style="margin-top: 16px" type="file" id="fileselect" accept=".kml,.shp,.geojson" />
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import Tile from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM'
	import {fromLonLat} from 'ol/proj'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Text from 'ol/style/Text'
	import Icon from 'ol/style/Icon'

	const shapefile = require("shapefile"); //读取shp
	import GeoJSON from 'ol/format/GeoJSON' //读取geojson
	import KML from 'ol/format/KML'; //读取kml

	export default {
		name: 'VectorJSON',
		data() {
			return {
				map: null,
				source: new SourceVector({
					wrapX: false,
				}),
			}
		},
		methods: {

        newCenter(x,z){
			let y=fromLonLat(x)
			this.map.getView().setCenter(y)
			this.map.getView().setZoom(z)
		},
		// 设定样式	
			style(feature) {
				let mystyle = new Style({
					fill: new Fill({color: "Gold"}),
					stroke: new Stroke({width: 2,color: "Lime",}),
					image: new Circle({ //点样式
						radius: 5,
						fill: new Fill({color: '#ff0000'}),
						stroke: new Stroke({color: '#fff',width: 2})
					}),	
					text: new Text({
						 text: feature.get('name') || " ",
						 font: '12px Calibri,sans-serif',
						 fill: new Fill({color: '#000'}),
						 stroke: new Stroke({color: '#fff',width: 2})
					}),					
				});
				return mystyle;
			},


			readFile() {
				let fileselect = document.querySelector('#fileselect')
				fileselect.addEventListener('change', function(e) {

					let files = e.target.files;
					let filetype = files[0].name.split('.')[1]
					    //console.log('文件类型' + filetype)
					if (files.length != 0 && filetype == "shp" || filetype == "geojson" || filetype == "kml") {

						let reader = new FileReader()

						if (filetype == "shp") {
							reader.readAsArrayBuffer(files[0])
						}
						if (filetype == "kml" || filetype == "geojson") {
							reader.readAsText(files[0])
						}

						let that = this;
						reader.onload = function(evt) {
							let filedata = evt.target.result;

							if (filetype == "shp") {
								shapefile.open(filedata).then(source => source.read()
										.then(function log(result) {
											if (result.done) return;
											var feature = new GeoJSON().readFeature(result.value, {
												dataProjection: 'EPSG:4326',
												featureProjection: 'EPSG:3857'
											});
											feature.setStyle(that.style(feature));
											that.source.addFeature(feature);
											return source.read().then(log);
										}))
									.catch(error => console.error(error.stack))
									
								that.newCenter([119.2275, 36.6185],6) //潍坊	
							}
							
							if (filetype == "kml") {
								let allFeatures=new KML().readFeatures(filedata,{
									dataProjection: 'EPSG:4326',
									featureProjection: 'EPSG:3857'
								});
								that.source.addFeatures(allFeatures);

								that.source.forEachFeature(function(feature) {
									feature.setStyle(that.style(feature));
								});
								that.newCenter([-95, 46],3) //美国	
							}

							if (filetype == "geojson") {
								let allFeatures=new GeoJSON().readFeatures(filedata,{
									dataProjection: 'EPSG:4326',
									featureProjection: 'EPSG:3857'
								});
								that.source.addFeatures(allFeatures);
								that.source.forEachFeature(function(feature) {
									feature.setStyle(that.style(feature));
								});
								that.newCenter([8.2275, 46.8185],4) //瑞士	
							}

						}

					} else {
						alert("请上传.shp，.geojson，.kml格式的文件！")
					}

				}.bind(this))
			},

			initMap() {


				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({source: new OSM()}),
						new LayerVector({source: this.source,})
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([116, 39]),
						zoom: 3,
						maxZoom:20
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

