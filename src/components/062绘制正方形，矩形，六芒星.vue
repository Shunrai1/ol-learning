/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-08
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 绘制正方形、矩形、六芒星</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
        <el-select id="type" v-model="tool">
          <el-option v-for="item in tools" :key="item.value" :value="item.value">{{item.label}}</el-option>
        </el-select>    
        </h4>

        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Draw, {
		createRegularPolygon,
		createBox
	} from 'ol/interaction/Draw'
	import Polygon from 'ol/geom/Polygon'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'

	export default {
		data() {
			return {
				tool: 'Square', 
				tools: [ 
					{
						value: 'Square',
						label: '方形'
					},
					{
						value: 'Rectangle',
						label: '矩形'
					},
					{
						value: 'Hexagram',
						label: '六芒星'
					},
					{
						value: 'None',
						label: '无'
					}
				],
				map: null, // 地图
				draw: null,
				source: new SourceVector({
					wrapX: false 
				})
			}
		},
		watch: {
			tool(newVal) {
				this.addInteraction()
			}
		},
		methods: {
			initMap() {
				let raster = new Tile({
					source: new OSM()
				});

				let vector = new LayerVector({
					source: this.source,
					// Vector层显示的样式
					style:new Style({
								  fill:new Fill({
									  color:"#00f"
								  }),
								  stroke:new Stroke({
									  width:2,
									  color:"#ff0",
								  }),
								  image: new Circle({  //点样式
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
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10
					})
				})
				this.addInteraction()
			},
			addInteraction() {
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}
				if (this.tool !== 'None') {
					let geometryFunction
					let type = 'Circle'

					if (this.tool === 'Square') {
						// 方形
						geometryFunction = createRegularPolygon(4)
					} else if (this.tool === 'Rectangle') {
						// 矩形
						geometryFunction = createBox()
					} else if (this.tool === 'Hexagram') {
						geometryFunction = function(coordinates, geometry) {
							//中心点
							var center = coordinates[0];
							//鼠标点击的另一个点
							var last = coordinates[1];
							var dx = center[0] - last[0];
							var dy = center[1] - last[1];
							//半径
							var radius = Math.sqrt(dx * dx + dy * dy);
							//旋转的角度
							var rotation = Math.atan2(dy, dx);
							//用来记录顶点坐标的数组
							var newCoordinates = [];
							//顶点个数
							var numPoints = 12;
							for (var i = 0; i < numPoints; ++i) {
								//顶点相对转过的角度
								var angle = rotation + i * 2 * Math.PI / numPoints;
								//确定凸顶点和凹顶点
								var fraction = i % 2 === 0 ? 1 : 0.58;
								//计算顶点的坐标
								var offsetX = radius * fraction * Math.cos(angle);
								var offsetY = radius * fraction * Math.sin(angle);
								newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
							}
							newCoordinates.push(newCoordinates[0].slice());
							if (!geometry) {
								geometry = new Polygon([newCoordinates]);
							} else {
								geometry.setCoordinates([newCoordinates]);
							}
							return geometry;
						}
					}

					this.draw = new Draw({
						source: this.source,
						type,
						geometryFunction
					})
					this.map.addInteraction(this.draw)
				}
			}
		},
		mounted() {
			this.initMap()
		}
	}
</script>
<style scoped>
    .container{
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
