/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-07
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 经纬度动态赋值（EPSG:3857）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div style="width:90%; margin:10px auto;">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-input v-model="lon" placeholder="经度" size="mini"> <template slot="prepend">经度</template>
					</el-input>
				</el-col>
				<el-col :span="12">
					<el-input v-model="lat" placeholder="纬度" size="mini"><template slot="prepend">纬度</template>
					</el-input>
				</el-col>
			</el-row>

		</div>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import 'ol-popup/src/ol-popup.css';
	import {Map,View} from 'ol'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import {Tile} from 'ol/layer';
	import OSM from 'ol/source/OSM'
	import {toStringHDMS} from 'ol/coordinate';
	import Popup from 'ol-popup';
	import {transform,fromLonLat,toLonLat} from 'ol/proj';

	export default {
		name: 'predict',
		data() {
			return {
				map: null,
				tableData: [],
				lon: 116,
				lat: 39,
			}
		},
		methods: {

			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new OSM()
						}),
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([119.2275, 39.6185]),
						zoom: 5
					})
				})

				var popup = new Popup();
				this.map.addOverlay(popup);

				this.map.on('singleclick', (evt) => {
					let lonlat=toLonLat(evt.coordinate)
					this.lon = lonlat[0].toFixed(5);
					this.lat = lonlat[1].toFixed(5);
					var prettyCoord = toStringHDMS(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 5);
					popup.show(evt.coordinate, '<div><h4>当前坐标为</h4><p>' + prettyCoord + '</p></div>');
				});

			}
		},
		mounted() {
			this.initMap()
		}
	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 550px;
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

