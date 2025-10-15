
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
		<h3>vue+openlayers:选择feature，弹窗，删除所选feature </h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<h4></h4>
		<div id="vue-openlayers"></div>
		<div id="popup-box" class="ol-popup">
			<el-button type="danger" size="mini" @click='delSelected()'>删除</el-button>
			<el-button type="danger" size="mini" @click='cancelSelected()'>关闭</el-button>
		</div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import OSM from 'ol/source/OSM'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import GeoJSON from 'ol/format/GeoJSON'
	import Overlay from 'ol/Overlay';
	import {Tile} from 'ol/layer';
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import Text from 'ol/style/Text'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Feature from 'ol/Feature'
	import {fromLonLat} from 'ol/proj';
	import {Draw,Modify,Select,Snap} from 'ol/interaction';

	// 引用数据
	import CN from '@/assets/data/json/liaoning_province.json'
	export default {
		name: 'deleteSelectedFeature',
		data() {
			return {
				map: null,
				select: null,
				overlayer: null,
				source: new SourceVector({
					features: new GeoJSON().readFeatures(CN, {
						dataProjection: 'EPSG:4326',
						featureProjection: "EPSG:3857"
					}),
				}),
				view: new View({
					projection: "EPSG:3857",
					center: fromLonLat([121.403963, 40.515119]), // 中国
					zoom: 6
				})
			}
		},
		methods: {
			delSelected() {
				var selectCollection = this.select.getFeatures();
				if (selectCollection.getLength() > 0) {
					this.source.removeFeature(selectCollection.item(0));
					this.overlayer.setPosition(undefined);
				}
			},
			cancelSelected() {
				this.overlayer.setPosition(undefined)
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
						}),
					],
					view: this.view
				})

				this.select = new Select()
				this.map.addInteraction(this.select);

				const box = document.getElementById('popup-box');
				this.overlayer = new Overlay({
					element: box,
					autoPan: {
						animation: {
							duration: 250,
						},
					},
				});
				this.map.addOverlay(this.overlayer);
				this.map.on('click', (e) => {
					let feature = this.map.forEachFeatureAtPixel(
						e.pixel,
						(feature, layer) => {
							return feature
						}
					)
					if (feature) {
						this.overlayer.setPosition(e.coordinate)
					} else {
						this.overlayer.setPosition(undefined);
					}

				})

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

	.ol-popup {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 5px;
		border-radius: 5px;
		border: 1px solid #cccccc;
		bottom: 12px;
		left: -10px;
		color: #FFFFFF;
		min-width: 150px;
	}

	.ol-popup:after,
	.ol-popup:before {
		top: 100%;
		border: solid transparent;
		content: " ";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
	}

</style>


