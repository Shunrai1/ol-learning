
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-19
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 根据 feature来适配到相应的地图</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4 >			
			<el-button type="warning" size="mini" @click="fitArea(polygonData)">适配 feature extent</el-button>
		</h4>
		<div id="vue-openlayers"></div>

	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import OSM from 'ol/source/OSM';
	import TileLayer from 'ol/layer/Tile';
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import Text from 'ol/style/Text'
	import Circle from 'ol/style/Circle'
	import Feature from "ol/Feature";
	import {Polygon} from "ol/geom";
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	
	export default {
		name: 'extent',
		data() {
			return {
				map: null,
				osmLayer:null,
				polygonFeature:null,
                myfeature:null,
				source: new SourceVector({wrapX: false}),
				polygonData:[[
							[102.94837595417002, 23.186590101623924],
							[112.86981796722073, 22.48475773547695],
							[113.16115972956521, 24.15412016222777],
							[102.94837595417002, 23.186590101623924]
						]],	
			}
		},
		methods: {
			fitArea(x){
				this.showPolygon(x)
				let size= this.map.getSize();
				this.map.getView().fit(this.myfeature,{
					size: size,
					padding: [50, 50, 50, 50]
				})
			},
			showPolygon(x) {
               let PolygonFeature = new Feature(
               		    new Polygon( x )); //绘制多边形的数据
                   this.source.addFeature(PolygonFeature);               	  
                   this.myfeature= PolygonFeature.getGeometry();
			},		
			initMap() {
				this.osmLayer=new TileLayer({
							source: new OSM(),
						})
				let fLayer=new LayerVector({
							source: this.source,
							style:new Style({
								stroke: new Stroke({
								  color: 'blue',   
								  lineJoin:'round',
								  width: 2,
								}),
							})
						})	
				
				this.map = new Map({
					layers: [
						this.osmLayer,fLayer
					],
					target: 'vue-openlayers',
					view: new View({
						center: [112.86981796722073, 22.48475773547695],
						projection: "EPSG:4326",
						zoom: 2,
						extent:[-180,-85,180,85]
					}),
				});
			},
		},
		mounted() {
			this.initMap();
		},

	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 570px;
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


