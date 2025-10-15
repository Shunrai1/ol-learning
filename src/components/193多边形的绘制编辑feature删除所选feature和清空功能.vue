
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-01-04
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 多个多边形的绘制，编辑feature，删除所选feature和清空功能</h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click='drawNew()'>新增绘制</el-button>
			<el-button type="primary" size="mini" @click='editSelected()'>编辑所选</el-button>
<!-- 			<el-button type="primary" size="mini" @click='closeEdit()'>取消编辑</el-button> -->
			<el-button type="danger" size="mini" @click='delSelected()'>删除所选</el-button>
			<el-button type="warning" size="mini" @click='clear()'>清空图层</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import SourceVector from 'ol/source/Vector'
	import LayerVector from 'ol/layer/Vector'
	import GeoJSON from 'ol/format/GeoJSON'
	import {Tile} from 'ol/layer';
	import OSM from 'ol/source/OSM';
	import {fromLonLat} from 'ol/proj';
	import {Draw,Modify,Select,Snap} from 'ol/interaction';

	// 引用数据
	import fData from '@/assets/data/json/liaoning_province.json'
	export default {
		name: 'VectorJSON',
		data() {
			return {
				map: null,
				select: null,
				modify: null,
				draw:null,
				source: new SourceVector({
					// 解析数据 
					features: new GeoJSON().readFeatures(fData, {
						dataProjection: 'EPSG:4326',
						featureProjection: "EPSG:3857"
					})
				}),
				view: new View({
					projection: "EPSG:3857",
					center: fromLonLat([116.403963, 39.915119]), // 中国
					zoom: 3
				})
			}
		},
		methods: {
             //  closeEdit(){
			// 		if (this.modify !== null) {
			// 			this.map.removeInteraction(this.modify)
			// 		}   
			// },
			drawNew() {
                  this.draw = new Draw({
                        source: this.source,
                        type:'Polygon' 
                    })
                    this.map.addInteraction(this.draw)
					this.draw.on('drawend',()=>{
						 this.map.removeInteraction(this.draw)
					})
			},
			editSelected() {
				if(this.modify!== null){
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
					this.source.removeFeature(selectCollection.item(0));
				}
			},
			clear() {
				this.source.clear()
			},

			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new OSM()
						}),
						new LayerVector({
							source: this.source
						}),

					],
					view: this.view
				})

				this.select = new Select();
				this.map.addInteraction(this.select);
				// 选中时刻,清除modify功能,需要点击编辑才能重新modify
				this.select.on('select',()=>{
					if(this.modify!==null){
						this.map.removeInteraction(this.modify)
					}
					
				})

			}
		},
		mounted() {
			this.initMap();
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


