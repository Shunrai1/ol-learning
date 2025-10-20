
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-07
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 编辑图形（放缩、平移、变形、旋转），停止编辑</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="startEdit()">启用编辑</el-button>
			<el-button type="danger" size="mini" @click="stopEdit()">停止编辑</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
    import 'ol/ol.css';
    import 'ol-ext/dist/ol-ext.min.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import Feature from 'ol/Feature'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import RegularShape from 'ol/style/RegularShape.js'
	import CircleStyle from 'ol/style/Circle'
	import {Point, LineString, Circle, Polygon} from "ol/geom"
	import {getCenter, getHeight, getWidth} from 'ol/extent';
	import {Draw, Modify, Translate,Select}  from 'ol/interaction'
	import Transform from 'ol-ext/interaction/Transform'
	import {never,platformModifierKeyOnly,primaryAction,shiftKeyOnly,always} from 'ol/events/condition';
	export default {
		data() {
			return {
				map: null,
				draw: null,
				interaction:null,
				source: new SourceVector({
					wrapX: false
				})
			}
		},
		methods: {
           startEdit(){
			       this.interaction = new Transform ({
			         enableRotatedTransform: false,
			         addCondition: shiftKeyOnly,
			         hitTolerance: 2,
			         translateFeature:true,
			         scale: true,
			         rotate: true,
			         keepAspectRatio: always ,
			         keepRectangle: false,
			         translate: true,
			         stretch: true,
			         // Get scale on points
			         pointRadius: function(f) {
			           var radius = f.get('radius') || 10;
			           return [radius, radius];
			         }
			       });
			       this.map.addInteraction(this.interaction);
		   },		   
		   stopEdit(){
			   if(this.interaction !== null){
				  this.map.removeInteraction(this.interaction); 
			   }
		   },
			showImage(){
				    this.source.addFeature(new Feature(new Polygon([[[34243, 6305749], [-288626, 5757848], [210354, 5576845], [300000, 6000000], [34243, 6305749]]])));
				    this.source.addFeature(new Feature(new LineString([[406033, 5664901], [689767, 5718712], [699551, 6149206], [425601, 6183449]])));
				    this.source.addFeature(new Feature(new Point(	[269914, 6248592])));
				    this.source.addFeature(new Feature(new Circle( [500000, 6400000], 100000 )));
			},			
			getStyle(feature) {
			      return [ new Style({
			        image: new RegularShape({
			          fill: new Fill({ color: [0,0,255,0.4]}),
			          stroke: new Stroke({color: [0,0,255,1],width: 1}),
			          radius: feature.get('radius') ||10,
			          points: 4,
			          angle: feature.get('angle')||0
			        }),
			        fill: new Fill({color: [255,0,255,0.4]}),
			        stroke: new Stroke({color: [255,0,0,1],width: 2})
			      })];
			    },				
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),
				});

				let vector = new LayerVector({
					source: this.source,
					style: this.getStyle
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:3857",
						center: [261720, 5951081],
						zoom: 5
					})
				})
			},				
		},
		mounted() {
			this.initMap()
			this.showImage()
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
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

