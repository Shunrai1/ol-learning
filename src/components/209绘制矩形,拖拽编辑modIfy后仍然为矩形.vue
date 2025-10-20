
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-06
*/

<template>
	<div class="container">
		<h3>vue+openlayers:绘制长方形，拖拽编辑后仍然为长方形</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="drawBox()">绘制长方形</el-button>
			<el-button type="danger" size="mini" @click="editBox()">编辑长方形</el-button>
		</h4>
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
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import {getCenter, getHeight, getWidth} from 'ol/extent';
	import {Draw, Modify, Translate,Select}  from 'ol/interaction'
	import  {createBox} from 'ol/interaction/Draw'
	import {never,platformModifierKeyOnly,primaryAction} from 'ol/events/condition';

	export default {
		data() {
			return {
				map: null,
				draw: null,
				select: null,
				modify: null,
				source: new SourceVector({
					wrapX: false
				})
			}
		},

		methods: {
//设置样式			
			getStyle(){
				const style = new Style({
				    geometry: function (feature) {
				        const modifyGeometry = feature.get('modifyGeometry');
				        return modifyGeometry ? modifyGeometry.geometry : feature.getGeometry();
				    },
				    fill: new Fill({
				        color: 'rgba(5, 5, 5, 0.3)',
				    }),
				    stroke: new Stroke({
				        color: '#ff0000',
				        width: 2,
				    })
				});
				return style
			},

//计算中心点		
				calculateCenter(geometry) { 
					let center, coordinates, minRadius;
					const type = geometry.getType();
					if (type === 'Polygon') {
						let x = 0;
						let y = 0;
						let i = 0;
						coordinates = geometry.getCoordinates()[0].slice(1);
						coordinates.forEach(function (coordinate) {
							x += coordinate[0];
							y += coordinate[1];
							i++;
						});
						center = [x / i, y / i];
					}
					let deltas;
					if (coordinates) {
						deltas = coordinates.map(function (coordinate) {
							const dx = coordinate[0] - center[0];
							const dy = coordinate[1] - center[1];
							return dx, dy;
						});
						// minRadius = Math.sqrt(Math.max.apply(Math, sqDistances)) / 3;
					} 
					return {
						center: center,
						deltas: deltas,
					};
				},
			
//编辑所选
			editBox() {
                   const defaultModify = new Modify({source: this.source});
                   const defaultModifyStyle = defaultModify.getOverlay().getStyleFunction();
				   let that=this;
                   this.modify = new Modify({
                       source: that.source,
                       deleteCondition: never,
                       insertVertexCondition: never,
                       style:function(feature){
                           that.source.getFeatures().forEach(function (modifyFeature) {
                               const modifyGeometry = modifyFeature.get('modifyGeometry');
                               if (modifyGeometry) {
                                   const point = feature.getGeometry().getCoordinates();
                                   let modifyPoint = modifyGeometry.point;
                                   if (!modifyPoint) {
                                       // 保存原始的 geometry and vertex position
                                       modifyPoint = point;
                                       modifyGeometry.point = modifyPoint;
                                       modifyGeometry.geometry0 = modifyGeometry.geometry;
                                       // get anchor and minimum radius of vertices to be used
                                       const result = that.calculateCenter(modifyGeometry.geometry0);
                                       modifyGeometry.center = result.center;
                                       modifyGeometry.deltas = result.deltas;
                                   }
                   
                                   const center = modifyGeometry.center;
                                   const minRadius = modifyGeometry.minRadius;
                                   let dx, dy;
                                   let dx0 = modifyPoint[0] - center[0];
                                   let dy0 = modifyPoint[1] - center[1];
                                   
                                   dx = point[0] - center[0];
                                   dy = point[1] - center[1];
                                   const geometry = modifyGeometry.geometry0.clone();
                                   geometry.scale(dx / dx0, dy / dy0, center);
                                   modifyGeometry.geometry = geometry;
                                   
                               }
                           });
                           return defaultModifyStyle(feature);
                       }
                   });
					
					
					this.map.addInteraction(this.modify);
					
					this.modify.on('modifystart', function (event) {
						event.features.forEach(function (feature) {
							feature.set(
								'modifyGeometry',
								{geometry: feature.getGeometry().clone()},
								true
							);
						});
					});
					this.modify.on('modifyend', function (event) {
						event.features.forEach(function (feature) {
							const modifyGeometry = feature.get('modifyGeometry');
							if (modifyGeometry) {
								feature.setGeometry(modifyGeometry.geometry);
								feature.unset('modifyGeometry', true);
							}
						});
					});
			},

//绘制矩形			
			drawBox() {   
				this.source.clear() //	清屏只保留一个				
				this.draw = new Draw({
					source: this.source,
					type: 'Circle',
					geometryFunction: createBox()
				})
				this.map.addInteraction(this.draw)
				
				this.draw.on('drawend',()=>{
					if (this.draw !== null) {
						this.map.removeInteraction(this.draw)
					}
				})
			},
//初始化地图			
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),
				});

				let vector = new LayerVector({
					source: this.source,
					style: this.getStyle()
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10
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
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


