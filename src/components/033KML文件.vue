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
		<h3>vue+openlayers: 上传KML文件，并在map上显示</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<h4>
			<input style="margin-top: 16px" type="file" id="fileselect"  accept=".kml"/>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import KML from 'ol/format/KML';
	import {Tile} from 'ol/layer';
	import OSM from 'ol/source/OSM'
	import { fromLonLat } from 'ol/proj'
	
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Text from 'ol/style/Text'
	import Icon from 'ol/style/Icon'	
	
	const shapefile = require("shapefile");
	export default {
		name: 'VectorJSON',
		data() {
			return {
				map: null,
				source: new SourceVector({
					wrapX: false,
					format:new KML({
					    extractStyles: false,
					  }),
				}),
				view: new View({
					projection: "EPSG:3857",
					center: fromLonLat([-95, 37.6185]),
					zoom: 3,
				})
			}
		},
		methods: {
			readFile() {
				let fileselect = document.querySelector('#fileselect')
				fileselect.addEventListener('change', function(e) {
					let files = e.target.files;
					let filetype = files[0].name.split('.')[1]
					// console.log('文件类型' + filetype)
					if (files.length === 0) {
						alert("没有数据，请重新上传新文件！")
						return
					}
					let reader = new FileReader()
                    reader.readAsText(files[0])             //读取KML文件的形式
					let that = this;
					reader.onload = function(evt) {
						let shparray = evt.target.result;
						
							// let allFeatures=new KML().readFeatures(shparray,
							let allFeatures=that.source.getFormat().readFeatures(shparray,							
							        {
							          dataProjection: 'EPSG:4326',
							          featureProjection: 'EPSG:3857'
							        }
							      );

							     that.source.addFeatures(allFeatures);
								 
								 that.source.forEachFeature(function(feature){
								         let style = new Style({
                                             fill: new Fill({color: 'purple' }) ,
								             stroke: new Stroke({ color: 'orange' }),
								             text: new Text({
								                 text: feature.get('name'),
								                 font: '12px Calibri,sans-serif',
								                 fill: new Fill({ color: '#000' }),
								                 stroke: new Stroke({
								                     color: '#fff', width: 2
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
					view: this.view
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

