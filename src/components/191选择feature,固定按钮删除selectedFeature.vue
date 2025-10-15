/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-04
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 删除selected feature </h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<h4><el-button type="danger" size="mini" @click='delSelected()'>删除已选</el-button></h4>
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
	import {fromLonLat} from 'ol/proj';
	import {Draw,Modify,Select,Snap} from 'ol/interaction';

	// 引用数据
	import CN from '@/assets/data/json/liaoning_province.json'
	export default {
		name: 'deleteSelectedFeature',
		data() {
			return {
				map: null,
				select:null,
				source: new SourceVector({
					// 解析数据 
					features: new GeoJSON().readFeatures(CN, {
						dataProjection: 'EPSG:4326',
						featureProjection: "EPSG:3857"
					})
				}),
				view: new View({
					projection: "EPSG:3857",
					center: fromLonLat([121.403963, 40.515119]), // 中国
					zoom: 6
				})
			}
		},
		methods: {
			delSelected(){
				var selectCollection = this.select.getFeatures();
				    if (selectCollection.getLength() > 0) {
				      this.source.removeFeature(selectCollection.item(0));
				    }
			},
			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new LayerVector({
							source: this.source
						}),
					],
					view: this.view
				})

				this.select = new Select()
				this.map.addInteraction(this.select);
			}
		},
		mounted() {

			this.initMap();
		}
	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 600px;
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

