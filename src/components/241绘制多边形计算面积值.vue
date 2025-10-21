/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-07-14
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 绘制多边形，计算面积值</h3>
		<p>大剑师兰特,还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click='paint("Polygon")'>绘制多边形</el-button>
			<el-button type="success" size="mini" @click='calc()'>计算面积</el-button>
			<el-button type="danger" size="mini" @click='clear()'>清除图层</el-button>			
		</h4>
		<p>面积值为：{{mianji}}平方公里</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Draw from 'ol/interaction/Draw'
	import {defaults} from 'ol/interaction';
	import Polygon from 'ol/geom/Polygon'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'

	export default {
		data() {
			return {
				map: null, // 地图
				draw: null,
				source: new SourceVector({
					wrapX: false
				}),
				mianji:0,
			}
		},
		methods: {
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
					})
				});

				let vector = new LayerVector({
					source: this.source,
					// Vector层显示的样式
					style: new Style({
						fill: new Fill({
							color: [255, 255, 255, 0.00001]
						}),
						stroke: new Stroke({
							width: 2,
							color: "#00f",
						}),
						image: new Circle({ //点样式
							radius: 5,
							fill: new Fill({
								color: '#ff0000'
							})
						}),
					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:3857",
						center: [0, 0],
						zoom: 5
					}),
					//屏蔽双击放大事件       
					interactions: defaults({
						doubleClickZoom: false,
					})
				})
			},
			clear() {
				this.source.clear();
			},
			calc() {
				let geom = this.source.getFeatures()[0].getGeometry()
				this.mianji = geom.getArea()/1000000
			},
			paint(x) {
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}

				this.draw = new Draw({
					source: this.source,
					type: 'Polygon',
				})
				this.map.addInteraction(this.draw)
				let that = this
				this.draw.on('drawend', (evt) => {
					let feature = evt.feature;
					let geom = feature.getGeometry();
					let mianji1 = geom.getArea()/1000000
					console.log(mianji1)
					that.map.removeInteraction(that.draw)
				})
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
		height: 590px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 380px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


