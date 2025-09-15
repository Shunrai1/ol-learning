
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-23
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 动态添加layer到layerGroup，并动态删除</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<span v-for="(item,index) in pointData" :key="index">
				<el-button type="danger" v-show="item.isShow" size="mini" @click='removegpLayer(item)'>删除{{item.myname}}
				</el-button>
				<el-button type="primary" v-show="!item.isShow" size="mini" @click='addgpLayer(item)'>添加{{item.myname}}
				</el-button>
			</span>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import GroupLayer from 'ol/layer/Group'
	import OSM from 'ol/source/OSM'
	import LayerVector from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Feature from 'ol/Feature'
	import Point from 'ol/geom/Point'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'

	export default {
		data() {
			return {
				pointData: [{
						myname: 'layer1',
						point: [114.064839, 22.548857],
						isShow: false,
					},
					{
						myname: 'layer2',
						point: [114.074839, 22.548857],
						isShow: false,
					},
				],
				map: null, // 地图
				draw: null,
				geoGroupLayer: new GroupLayer({
					layers: [],
					zIndex: 3,
					myname:"geoGroupLayer",
				}),
			}
		},

		methods: {
			removegpLayer(data) {
				data.isShow = !data.isShow;
	
				this.geoGroupLayer.getLayers().getArray().forEach((layer, index, array) => {	
					
					if (layer.get('myname') == data.myname) {
						// this.geoGroupLayer.getLayers().getArray().splice(index,1) 也可以
						array.splice(index, 1)
					}
				})
			    this.map.removeLayer(this.geoGroupLayer);
				this.map.addLayer(this.geoGroupLayer)
				
			},
			addgpLayer(data) {
				this.map.removeLayer(this.geoGroupLayer);
				let pointFeature = new Feature({
					geometry: new Point(data.point),
				})
				let pointsource = new VectorSource({
					wrapX: false
				});
				pointsource.addFeature(pointFeature)
				let vector = new LayerVector({
					myname: data.myname,
					source: pointsource,
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
							radius: 10,
							fill: new Fill({
								color: '#ff00ff'
							})
						}),
					})
				});

				this.geoGroupLayer.getLayers().getArray().push(vector);
				 data.isShow = !data.isShow;
				this.map.addLayer(this.geoGroupLayer)
			},

			initMap() {
				let raster = new Tile({
					source: new OSM(),
					myname: "OSM"
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster],
					view: new View({
						projection: "EPSG:4326",
						center: [114.064839, 22.548857],
						zoom: 13
					})
				})
			},


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
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


