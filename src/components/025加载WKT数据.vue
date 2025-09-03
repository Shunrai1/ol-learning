/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-28
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 读取WKT数据，显示图形</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>
		<div id="info"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {transform} from 'ol/proj';
	import Feature from 'ol/Feature'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	// 核心代码块
	import WKT from 'ol/format/WKT';

	export default {
		name: 'read-WKT',
		data() {
			return {
				map: null,
				source: new VectorSource({wrapX: false }),
				wktGeometry: "POLYGON((6.027164 49.524078,6.088064 49.680508,5.948726 49.772232,5.941587 49.91943,6.03742 50.064381,6.147439 50.130783,6.211109 50.166946,6.312177 50.134426,6.340263 49.998951,6.525142 49.858585,6.734586 49.815399,6.715019 49.685902,6.603117 49.621159,6.636707 49.462303,6.57162 49.490456,6.315996 49.495625,6.02716449.524078))",
			}
		},
		methods: {
			
			readWKT(){
				let geom_wkt=new WKT().readGeometry(this.wktGeometry,{
					dataProjection:"EPSG:4326",
					featureProjection:"EPSG:3857"
				})
				let feat_wkt=new Feature({
					geometry:geom_wkt
				})
				this.source.addFeature(feat_wkt);
			},
	
			initMap() {

				this.map = new Map({
					layers: [
						new TileLayer({
							source: new OSM()
						}),
						new VectorLayer({
							source:this.source,
							style:new Style({
								  fill:new Fill({
									  color:"#00f"
								  }),
								  stroke:new Stroke({
									  width:2,
									  color:"#ff0",
								  }),
								  image: new Circle({  //点样式
									radius: 5, 
									fill: new Fill({
									  color: '#ff0000'
									})
								  }),
							})
						}),	 
					],
					target: 'vue-openlayers',
					view: new View({
						center: transform([3, 37.0902],"EPSG:4326","EPSG:3857"),
						projection: "EPSG:3857",
						zoom: 4,
					}),
				});

			},
		},
		mounted() {
			this.initMap();
			this.readWKT()
		},
	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 520px;
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



