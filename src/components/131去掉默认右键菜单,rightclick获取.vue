/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-09-09
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 去掉鼠标右键默认菜单，rightClick显示feature信息</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
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
							[102.94837, 23.18659],
							[111.86981, 22.48475],
							[112.12345, 26.48475],
							[113.16115, 24.15412],
							[102.94837, 23.186594]
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
				
			rightClick(){
				this.map.getViewport().addEventListener('contextmenu', (event) => {
						event.preventDefault() //去掉原始右键菜单
				
						var coordinate = this.map.getEventCoordinate(event)
						const pixel = this.map.getPixelFromCoordinate(coordinate)
						const cfeature = this.map.forEachFeatureAtPixel(pixel, (feature,layer)=> {
						  return feature
						})
						if (cfeature){
						 let msg1=JSON.stringify(cfeature)
						 let msg=`<div>${msg1}</div> `
						 alert(msg)
						}
						console.log(cfeature)
				})	
			},	
							
			initMap() {
				this.osmLayer=new TileLayer({
							source: new OSM(),
						})
				let fLayer=new LayerVector({
							source: this.source,
							style:new Style({
								stroke: new Stroke({
								  color: 'darkGreen',   
								  lineJoin:'round',
								  width: 2,
								}),
								fill:new Fill({
									color:'rgba(255,0,255,0.5)'
								})
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
			this.fitArea(this.polygonData)
			this.rightClick()
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
		height: 450px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

</style>


