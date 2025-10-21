
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-20
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 自定义js横向卷帘，图层名称跟着分割线移动</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-radio v-model="radio" label="1">terrain</el-radio>
			<el-radio v-model="radio" label="2">watercolor</el-radio>
			<el-button type="primary" size="mini" @click="startSwipe()">开启卷帘</el-button>
			<el-button type="danger" size="mini" @click="endSwipe()">关闭卷帘</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import TileLayer from 'ol/layer/Tile';
	import View from 'ol/View';
	import XYZ from 'ol/source/XYZ';
	import Stamen from 'ol/source/Stamen';
	import {fromLonLat} from 'ol/proj';
	import Swipe from '@/assets/js/Swipe.js'
	export default {
		data() {
			return {
				map: null,
				StamenMap1: null,
				StamenMap2: null,
				swipeControl: null,
				radio:'1'
			};
		},
		watch:{
			radio(newVal){
				if(newVal=='1'){
					this.StamenMap1.setVisible(true);
					this.StamenMap2.setVisible(false);
					this.removeSwipe()
				}else{
					this.StamenMap2.setVisible(true);
					this.StamenMap1.setVisible(false);
					this.removeSwipe()
				}
			},
		},
		
		methods: {
			showLayer(){
				if(this.radio=='1'){
					this.StamenMap1.setVisible(true);
					this.StamenMap2.setVisible(false);
				}else{
					this.StamenMap2.setVisible(true);
					this.StamenMap1.setVisible(false);
				}				
			},

			startSwipe(){
				if(this.radio=='1'){
					this.StamenMap2.setVisible(true);
					this.goSwipe(this.StamenMap1, this.StamenMap2, 'terrain', 'watercolor')
				}else{
					this.StamenMap1.setVisible(true);
					this.goSwipe(this.StamenMap2, this.StamenMap1, 'watercolor', 'terrain')
				}
			},
			removeSwipe(){
				if(this.swipeControl!= null){
					this.map.removeControl(this.swipeControl)
				}	
			},
			endSwipe(){
                this.removeSwipe()
				this.showLayer()
			},

			goSwipe(layerL, layerR, textL, textR) {
				this.swipeControl = new Swipe({
					className: 'abc',
					leftText: textL,
					rightText: textR,
				});
				this.map.addControl(this.swipeControl); // 左侧
				this.swipeControl.addLayer(layerL);
				this.swipeControl.addLayer(layerR, true); // 右侧
			},
			initMap() {
				this.StamenMap1 = new TileLayer({
					visible:false,
					source: new Stamen({
						layer: "terrain",
					})
				})
				this.StamenMap2 = new TileLayer({
					visible:false,
					source: new Stamen({
						layer: "watercolor",
					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						this.StamenMap1,
						this.StamenMap2,
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-116, 39]),
						zoom: 2
					}),
				});
			},
		},
		mounted() {
			this.initMap()
			this.showLayer()
		}
	}
</script>
<style>
	.container {
		width: 840px;
		height: 640px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

	.abc {
		background: transparent;
		position: absolute;
		top: 70%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 500px;
		height: 128px;
	}

	.abc button {
		background: url('../assets/img/left-right.png') left top no-repeat;
		background-size:64px 64px;
		width: 64px;
		height: 128px;
		position: absolute;
		top: 70%;
		left: 50%;
		transform: translate(-50%, -50%);
		cursor: ew-resize;
		outline: 0px solid #ddd;
	}

	.abc button:hover {
		outline: 0px solid #000000 !important;
	}

	.abc button:focus {
		outline: 0px solid #000000 !important;
	}

	.abc .leftSwipeClass {
		position: absolute;
		top: 90%;
		left: 0;
		width: 235px;
		padding-right:15px;
		text-align: right;
		font-size: 20px;
		color: #ff0000
	}

	.abc .rightSwipeClass {
		position: absolute;
		top: 90%;
		right: 0;
		width: 235px;
		padding-left:15px;
		text-align: left;
		font-size: 20px;
		color: #FF0000
	}
</style>

