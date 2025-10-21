/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-01-19
*/

<template>
	<div class="container">
		<h3>vue+openlayers：利用高德逆地理编码，点击地图，弹出某点坐标和地址信息</h3>
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
				addressName: '',
			}
		},
		methods: {
			findAddress(lonlat) {
				let gdkey = '99de30d260425c9a67a6a263c484323b';
				axios({
					method: 'get',
					url: `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${lonlat}&key=${gdkey}&radius=10&extensions=all`,
					data: {}
				}).then((res) => {
					if (res.status === 200) {
						this.addressName = res.data.regeocode.formatted_address
					} else {
						console.log(res.statusText);
					}
				})
			},

			initMap() {
				let arcgisLayer = new Tile({
					source: new XYZ({
                        url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
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

				this.map.on('click', (evt) => {
					const coordinate = toLonLat(evt.coordinate);
					let lon = coordinate[0].toFixed(6);
					let lat = coordinate[1].toFixed(6);
					let lnglat = lon + ',' + lat
					this.findAddress(lnglat)
					setTimeout(() => {
						content.innerHTML = '<p>经度:' + lon + '，纬度:' + lat + '</p><p>地址：' + this
							.addressName + '</p>';
						overlay.setPosition(evt.coordinate);
					}, 1000)

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
		background-color: rgba(250, 0, 120, 0.8);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
		padding: 10px;
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
		border-top-color: rgba(250, 0, 120, 0.8);
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


