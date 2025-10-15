/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-11
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 解决drawend后不能获取当前feature的办法</h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<h4>
			<el-button type="warning" size="mini" @click='paint("Rectangle",0)'>绘制（ 获取不到 feature ）</el-button>
			<el-button type="primary" size="mini" @click='paint("Rectangle",1)'>绘制（ 能获取到 feature ）</el-button>
			<el-button type="danger" size="mini" @click='clear()'>清除图层</el-button>
		</h4>
		<div id="vue-openlayers"></div>
		<div>feature信息：{{featureInfo}}</div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Draw, {createBox} from 'ol/interaction/Draw'
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
				allFeat: [],
				featureInfo: ''
			}
		},
		methods: {

			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})
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

					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [OSM_Layer,vector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10
					}),
				})
			},

			clear() {
				this.source.clear();
				this.featureInfo='';
			},
			paint(x,y) {
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}
				let type = "Circle"
				let geometryFunction
				if (x === 'Rectangle') {
					geometryFunction = createBox()
				} else {
					type = x;
				}
				this.draw = new Draw({
					source: this.source,
					type,
					geometryFunction
				})
				this.map.addInteraction(this.draw)

				this.draw.on('drawend', (evt) => {
					
					if(y){//下面的这种形式可以获取到feature
						this.allFeat.push(evt.feature) //核心代码
						this.featureInfo=JSON.stringify(this.allFeat)
					}else{//以下方法获取不到刚画的feature
						let aaa=this.source.getFeatures()
						this.featureInfo=JSON.stringify(aaa)
					}				
					this.map.removeInteraction(this.draw)
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
		height: 300px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


