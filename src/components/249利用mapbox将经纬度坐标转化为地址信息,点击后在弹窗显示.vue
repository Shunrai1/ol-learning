
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-12-06
*/

<template>
	<div class="container">
		<h3>点击某点，转化经纬度坐标为地址信息，弹窗显示</h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
		<div id="popup-box" class="ol-popup">
			<a href="#" id="popup-close" class="ol-popup-closer"></a>
			<div id="popup-content"></div>
		</div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import {fromLonLat,toLonLat,transform} from "ol/proj";
	import axios from "axios";
	import Overlay from 'ol/Overlay';
	export default {
		data() {
			return {
				map: null,
				addressName:'',
			}
		},
		methods: {
			findAddress(x, y) {
				axios({
					method: 'get',
					url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${x},${y}.json?access_token=pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ`,
					data: {}
				}).then((res) => {
					if (res.status === 200) {
						if (res.data.features.length != 0) {
							this.addressName = res.data.features[0].place_name
							console.log(this.addressName)
						} else {
							this.addressName = "暂无地名"
						}
					} else {
						console.log(res.statusText);
					}
				})
			},


			initMap() {
				let arcgisLayer = new Tile({
					source: new XYZ({
						url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
					})
				});

				const box = document.getElementById('popup-box');
				const content = document.getElementById('popup-content');
				const closer = document.getElementById('popup-close');

				// 设置浮动层                
				const overlay = new Overlay({
					element: box, //绑定元素
					autoPan: {
						animation: {
							duration: 250,
						},
					},
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [arcgisLayer],
					overlays: [overlay],
					view: new View({
						center: [13247019.404399557, 4721671.572580107],
						zoom: 8
					})
				});

				closer.onclick = function() {
					overlay.setPosition(undefined);
					closer.blur();
					return false;
				};

				this.map.on('singleclick', (evt) => {
					const coordinate = toLonLat(evt.coordinate);
					let lon = coordinate[0].toFixed(2);
					let lat = coordinate[1].toFixed(2);
					this.findAddress(lon,lat)				
				  setTimeout(()=>{
					content.innerHTML = '<p>坐标：经度:' + lon + '，纬度:' + lat + '</p><p>地址：'+ this.addressName +'</p>';
					overlay.setPosition(evt.coordinate);
				  },1000)
	

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
		width: 1000px;
		height: 640px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 520px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

	.ol-popup {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.8);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
		padding: 3px;
		border-radius: 10px;
		border: 1px solid #cccccc;
		bottom: 12px;
		left: -50px;
		color: #FFFFFF;
		width: 300px;
	}

	.ol-popup:after,
	.ol-popup:before {
		top: 100%;
		border: solid transparent;
		content: " ";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
	}

	.ol-popup:after {
		border-top-color: rgba(0, 0, 0, 0.8);
		border-width: 10px;
		left: 48px;
		margin-left: -10px;
	}

	.ol-popup:before {
		border-top-color: #cccccc;
		border-width: 11px;
		left: 48px;
		margin-left: -11px;
	}

	.ol-popup-closer {
		text-decoration: none;
		position: absolute;
		top: 2px;
		right: 8px;
		color: #fff;
	}

	.ol-popup-closer:after {
		content: "✖";
	}
</style>

