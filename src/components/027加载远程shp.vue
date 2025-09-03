/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-31
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载远程shp数据，map上显示图形</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import GeoJSON from 'ol/format/GeoJSON'
	import {Tile} from 'ol/layer';
	import OSM from 'ol/source/OSM'
	export default {
		name: 'VectorJSON',
		data() {
			return {
				map: null,
				source: new SourceVector({
					wrapX: false
				}),
				view: new View({
					projection: "EPSG:4326",
					center: [8.2275, 6.8185], 
					zoom: 3
				})
			}
		},
		methods: {
             // 错误实验:
			// (1) let shp="/data/test.shp"; //本地数据会报错
			// (2) shapefile.open(shp,"",{encoding:'utf-8'}) 报错
			// shapefile.open(shp)单独可以
			readshp() {
				let shp="https://cdn.rawgit.com/mbostock/shapefile/master/test/points.shp";
				let dbf="https://cdn.rawgit.com/mbostock/shapefile/master/test/points.dbf";
                let that = this;
				shapefile.open(shp,dbf,{encoding:'utf-8'}).then(source => source.read()
						.then(function log(result) {
							if (result.done) return;
							let feature = new GeoJSON().readFeature(result.value);
							that.source.addFeature(feature);
							return source.read().then(log);
						}))
					.catch(error => console.error(error));
			},

			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new OSM()
						}),
						new LayerVector({
							source: this.source
						}),

					],
					view: this.view
				})

			}
		},
		mounted() {
			this.initMap()
			this.readshp()
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
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


