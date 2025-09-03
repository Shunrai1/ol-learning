/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-02
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 上传KMZ文件，并在map上显示</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<h4>
			<input style="margin-top: 16px" type="file" id="fileselect" accept=".kml,.kmz,.zip" />
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
	import KML from 'ol/format/KML';
	import Tile from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM'
	import {fromLonLat} from 'ol/proj'

	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Text from 'ol/style/Text'
	import Icon from 'ol/style/Icon'

	const JSZip = require("jszip");

	export default {
		name: 'kmz',
		data() {
			return {
				map: null,
				source: new SourceVector({
					wrapX: false,
					format: new KML({
						extractStyles: false,
					}),
				}),
				
			}
		},
		methods: {
			randomRgbaColor() { //随机生成RGBA颜色
			    var r = Math.floor(Math.random() * 256); //随机生成256以内r值
			    var g = Math.floor(Math.random() * 256); //随机生成256以内g值
			    var b = Math.floor(Math.random() * 256); //随机生成256以内b值
			    var alpha =1;// Math.random(); //随机生成1以内a值
			    return `rgb(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
			},
		
			mystyle(fea){
				let style = new Style({
					fill: new Fill({
						color: 'purple'
					}),
					stroke: new Stroke({
						color: 'orange'
					}),
					image: new Circle({ //点样式
						radius: 10,
						fill: new Fill({color: this.randomRgbaColor()}),
						stroke: new Stroke({color: '#fff',width: 2})
					}), 
					text: new Text({
						text: fea.get('name')||" ",
						font: '12px Calibri,sans-serif',
						fill: new Fill({color: '#000'}),
						stroke: new Stroke({color: '#fff',width: 2}),
						offsetX:"20",
						offsetY:"20"
					})
				});
				return style;
			},
			
			readFile() {
				let fileselect = document.querySelector('#fileselect')
				fileselect.addEventListener('change', function(e) {
					let files = e.target.files;
					let filetype = files[0].name.substring(files[0].name.lastIndexOf('.') + 1);
					// console.log('文件类型' + filetype)
					if (files.length === 0||filetype!='kmz') {
						alert("请重新上传kmz格式的文件！")
						return
					}
                      let that=this;
					  let zip = new JSZip();		
					  zip.loadAsync(files[0]).then(function(zip11){
						  //读取包含kml的文件,这是示例最难点
						  const kmlFile = zip.file(/.kml$/i)[0].async("string").then((item)=>{ 
                                
								let allFeatures = new KML().readFeatures(
									item, {
										dataProjection: 'EPSG:4326',
										featureProjection: 'EPSG:3857'
									}
								);							
								that.source.addFeatures(allFeatures);
								
								that.source.forEachFeature(function(feature) {
								   feature.setStyle(that.mystyle(feature));
								});

							});
					  });

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
						center:fromLonLat([-19, 65]),
						zoom: 5,
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


