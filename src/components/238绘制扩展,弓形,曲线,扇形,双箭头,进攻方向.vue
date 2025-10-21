/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-05-16
*/

<template>
	<div class="container">
		<h3>vue+openlayers:绘制扩展，弓形、曲线、扇形、双箭头、进攻方向...</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
            <el-button type="primary" size="mini" @click="activate('TextArea')"> 文本框</el-button>
			<el-button type="primary" size="mini" @click="activate('Point')"> 点</el-button>
			<el-button type="primary" size="mini" @click="activate('Polyline')">折线</el-button>
			<el-button type="primary" size="mini" @click="activate('FreeHandLine')">自由线</el-button>
			<el-button type="primary" size="mini" @click="activate('Arc')"> 弧</el-button>
			<el-button type="primary" size="mini" @click="activate('Curve')"> 曲线</el-button>
			<el-button type="primary" size="mini" @click="activate('Circle')"> 圆</el-button>
			<el-button type="primary" size="mini" @click="activate('Ellipse')"> 椭圆</el-button>
			<el-button type="primary" size="mini" @click="activate('Polygon')"> 多边形</el-button>
			<el-button type="primary" size="mini" @click="activate('FreePolygon')">自由多边形</el-button>			
			<el-button type="primary" size="mini" @click="activate('RectAngle')"> 矩形</el-button>			
			<el-button type="primary" size="mini" @click="activate('Lune')">弓形</el-button>
			<el-button type="primary" size="mini" @click="activate('Sector')">扇形</el-button>
			<el-button type="primary" size="mini" @click="activate('GatheringPlace')">测试集结地</el-button>
			<el-button type="primary" size="mini" @click="activate('DoubleArrow')">双箭头</el-button>
			<el-button type="primary" size="mini" @click="activate('StraightArrow')">细直箭头</el-button>
			<el-button type="primary" size="mini" @click="activate('FineArrow')">粗单尖头</el-button>
			<el-button type="primary" size="mini" @click="activate('AttackArrow')">进攻方向</el-button>			
			<el-button type="primary" size="mini" @click="activate('AssaultDirection')">粗单直箭头</el-button>
			<el-button type="primary" size="mini" @click="activate('TailedAttackArrow')">进攻方向（尾）</el-button>
			<el-button type="primary" size="mini" @click="activate('TailedSquadCombat')">分队战斗行动（尾）</el-button>
			<el-button type="primary" size="mini" @click="activate('SquadCombat')">分队战斗行动</el-button>						
			<el-button type="primary" size="mini" @click="activate('RectFlag')">矩形标志旗</el-button>
			<el-button type="primary" size="mini" @click="activate('TriangleFlag')">三角标志旗</el-button>
			<el-button type="primary" size="mini" @click="activate('CurveFlag')">曲线标志旗</el-button>							
		</h4>
		<div id="vue-openlayers"></div>

	</div>
</template>
<script>
	
	import 'ol/ol.css'
	import 'ol-plot/dist/ol-plot.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import GeoJSON from 'ol/format/GeoJSON'
	import {fromLonLat} from 'ol/proj'
	import Draw from 'ol/interaction/Draw'
	import Plot from 'ol-plot'

	export default {
		data() {
			return {
				map: null,
				draw: null,
				source: new SourceVector({
					wrapX: false
				}),

			}
		},

		methods: {
			activate(type) {
             const plot = new Plot(this.map, {
               zoomToExtent: true,
             });				
			  plot.plotEdit.deactivate();
			  
			  let params={
				  isfill:true
			  }
			  
			  plot.plotDraw.activate(type, params);
			},
				
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([113.1206, 23.034996]),
						zoom: 10
					})
				})


 
				const plot = new Plot(this.map, {
				  zoomToExtent: true,
				});
				this.map.on('click', (event)=> {   //点击用于编辑
				  const feature = this.map.forEachFeatureAtPixel(event.pixel, function (feature) {
				    return feature;
				  });
				  if (feature && feature.get('isPlot') && !plot.plotDraw.isDrawing()) {
					  console.log(feature)
				    plot.plotEdit.activate(feature);
				  } else {
				    plot.plotEdit.deactivate();
				  }
				});
				
			},

		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 680px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 430px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}

	.geoBox {
		position: absolute;
		width: 90%;
		height: 300px;
		overflow-y: auto;
		z-index: 5;
		left: 5%;
		bottom: 30px;
		background-color: aliceblue;
		padding: 10px;
	}
	h4 > .el-button--mini{ margin-bottom:5px;}
</style>


