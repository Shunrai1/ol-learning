
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-01-11
*/

<template>
	<div class="container">
		<h3>vue+openlayers：添加删除修改feature信息，双向指示互动</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click='drawNew()'>新增绘制</el-button>
			<el-button type="primary" size="mini" @click='editSelected()'>编辑所选</el-button>
			<el-button type="danger" size="mini" @click='delSelected()'>删除所选</el-button>
			<el-button type="warning" size="mini" @click='clear()'>清空图层</el-button>
			<el-button type="success" size="mini" @click='exportFeature()'>导出feature</el-button>
		</h4>
		<div class="list">
			<div v-for="(item,index) in list" :key="index" style="margin-top: 10px; margin:0 10px;"
				@mouseover="showTip(index)" @mouseleave="closeTip(index)">
				<div>
					<el-link :type="item.show? 'primary': 'danger'">
						{{item.descName}}
					</el-link>
				</div>
			</div>
		</div>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import XYZ from 'ol/source/XYZ'
	import Feature from 'ol/Feature'
	import {Polygon} from "ol/geom"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Text from 'ol/style/Text'
	import Stroke from 'ol/style/Stroke'
	import {Draw,Modify,Select,Snap} from 'ol/interaction';

	export default {
		data() {
			return {
				map: null,
				source: new VectorSource({
					wrapX: false
				}),
				tipSource: new VectorSource({
					wrapX: false
				}),
				list: [],
				drawfeatures: [],
			};
		},

		methods: {
			updateList() {
				this.list = JSON.parse(JSON.stringify([]))
				this.drawfeatures.forEach((feature, index) => {

					let g = feature.getGeometry();
					let name = '围栏' + index;
					let one = {
						descName: name,
						show: true,
						area: g
					};
					this.list.push(one)
				})
			},
			
			exportFeature(){
				let allFeat=this.source.getFeatures();
				console.log(allFeat);
			},

			drawNew() {
				this.draw = new Draw({
					source: this.source,
					type: 'Polygon'
				})
				this.map.addInteraction(this.draw)
				this.draw.on('drawend', (evt) => {
					let fea = evt.feature;
					this.drawfeatures.push(fea);
					this.map.removeInteraction(this.draw)
					this.updateList()
				})

			},
			editSelected() {
				if (this.modify !== null) {
					this.map.removeInteraction(this.modify);
				}

				let selectCollection = this.select.getFeatures();
				if (selectCollection.getLength() > 0) {
					this.modify = new Modify({
						features: this.select.getFeatures(),
					});
					this.map.addInteraction(this.modify);
				}
			},
			delSelected() {
				let selectCollection = this.select.getFeatures();
				if (selectCollection.getLength() > 0) {
					let index = selectCollection.item(0).get('listindex')
					this.source.removeFeature(selectCollection.item(0));
				}
				this.drawfeatures=this.source.getFeatures();
				this.updateList()
			},
			clear() {
				this.source.clear();
				this.drawfeatures = [];
				this.list = [];
				this.updateList()
			},

			// 关闭列表提示    
			closeTip(x) {
				this.tipSource.clear();
				this.list[x].show = true;
			},
			// 开启列表提示   
			showTip(x) {
				this.list[x].show = false;
				this.showTipLayer(x)
			},
			// 构建提示层        
			showTipLayer(i) {
				this.tipSource.clear();
				const tipFeature = new Feature({
					geometry: this.list[i].area,
				});
				const tipStyle = new Style({
					// rotation: 15,
					stroke: new Stroke({
						color: '#f00',
						width: 3
					}),
					fill: new Fill({
						color: "rgba(255,0,0,0.1)"
					})
				});
				tipFeature.setStyle(tipStyle);
				this.tipSource.addFeature(tipFeature);
			},

			// click feature层，显示列表中对应信息
			clickFeature() {
				this.map.on("click", e => {
					// if (e.dragging) {
					//     return;
					// }
					let feature = this.map.forEachFeatureAtPixel(
						e.pixel,
						(feature, layer) => {
							return feature
						}
					)
					// 更改鼠标样式   
					if (feature == undefined) {
						this.map.getTargetElement().style.cursor = "auto"
					} else {
						this.map.getTargetElement().style.cursor = "pointer"
					}

					if (feature) {
						let i = this.drawfeatures.indexOf(feature); //feature.get("listindex")

						for (let j = 0; j < this.list.length; j++) {
							if (j == i) {
								this.list[j].show = false;

							} else {
								this.list[j].show = true;
							}
						}

					} else {
						for (let j = 0; j < this.list.length; j++) {
							this.list[j].show = true;
						}

					}
				})
			},


			// 初始化地图     
			initMap() {

				let iconStyle = new Style({
					stroke: new Stroke({
						color: 'purple',
						width: 2
					}),
					fill: new Fill({
						color: "rgba(255,0,0,0)"
					}),
					text: new Text({
						font: '12px Calibri, sans-serif',
						anchor: [0.5, 1.5],
						textAlign: 'center',
						offsetX: -50,
						offsetY: 20,
						fill: new Fill({
							color: '#000'
						}),
					})
				});


				let google_Layer = new TileLayer({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
				})

				let drawLayer = new VectorLayer({ //轨迹层
					source: this.source,
					style: feature => {
						let i = this.drawfeatures.indexOf(feature);
						iconStyle.getText().setText('围栏' + i)
						return iconStyle
					}
				});

				let tipLayer = new VectorLayer({ //轨迹层
					source: this.tipSource,
					zIndex: 10000,
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						// google_Layer,
						drawLayer,
						tipLayer
					],
					view: new View({
						projection: "EPSG:4326",
						center: [139.6485790340825, 35.27194604343114],
						zoom: 14
					}),
				})

				this.clickFeature();

				this.select = new Select();
				this.map.addInteraction(this.select);
				// 选中时刻,清除modify功能,需要点击编辑才能重新modify
				this.select.on('select', () => {
					if (this.modify !== null) {
						this.map.removeInteraction(this.modify)
					}

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
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 600px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		float: left;
	}

	.list {
		width: 200px;
		height: 400px;
		margin: 0 auto;
		float: left;
	}
</style>


