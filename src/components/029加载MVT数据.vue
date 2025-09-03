/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-11
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 使用MVT格式读取矢量瓦片数据，显示图形</h3>
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
	import WMTSTileGrid from 'ol/tilegrid/WMTS';
	import VectorTileLayer from 'ol/layer/VectorTile';
	import VectorTile from 'ol/source/VectorTile';
	import MVT from 'ol/format/MVT';

	import Feature from 'ol/Feature'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'

	export default {
		name: 'read-MVT',
		data() {
			return {
				map: null,
	        }
		},
		methods: {
			style(){
				const circleStyle = new Style({
				    image: new Circle({
				      radius: 5,
				      fill: new Fill({
				        color: 'Crimson',
				      })
				    })
				  });
                return circleStyle;
			},
					
			readMVT(){
				const myLayer = new VectorTileLayer({
				    style: this.style(),
				    source:  new VectorTile({
				      visible: true,
				      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2020-03-18T00:00:00Z&layer=GRanD_Dams&tilematrixset=2km&Service=WMTS&Request=GetTile&Version=1.0.0&FORMAT=application%2Fvnd.mapbox-vector-tile&TileMatrix={z}&TileCol={x}&TileRow={y}',
				      format: new MVT(),
				      projection: 'EPSG:4326',
				      tileGrid: new WMTSTileGrid({
				        extent: [-180, -90, 180, 90],
				        resolutions: [0.5625, 0.28125, 0.140625, 0.0703125, 0.03515625, 0.017578125],
				        tileSize: [512, 512]
				      })
				    })
				  });				
				this.map.addLayer(myLayer);
			},
			
			initMap() {

				this.map = new Map({
					layers: [
						new TileLayer({
							source: new OSM()
						}), 
					],
					target: 'vue-openlayers',
					view: new View({
						center: [0, 0],
						projection: "EPSG:4326",
						zoom: 4,
					}),
				});

			},
		},
		mounted() {
			this.initMap();
			this.readMVT();
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


