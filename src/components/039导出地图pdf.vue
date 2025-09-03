/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-19
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 导出地图（pdf）</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<h4>
			<el-button type="primary" @click="exportPDF" size="mini">导出 pdf 地图</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import WMTSTileGrid from 'ol/tilegrid/WMTS';
	import VectorTileLayer from 'ol/layer/VectorTile';
	import VectorTile from 'ol/source/VectorTile';
	import MVT from 'ol/format/MVT';
	import Feature from 'ol/Feature'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import {
		jsPDF
	} from "jspdf";

	export default {
		name: 'read-MVT',
		data() {
			return {
				map: null,
			}
		},
		methods: {
			// 导出地图
			exportPDF() {
				this.map.once('rendercomplete', () => {
					const mapCanvas = document.createElement('canvas');
					const size = this.map.getSize();

					// 设定尺寸为A4(297*210),设定分辨率为150dpi
					const width = Math.round((297 * 150) / 25.4);
					const height = Math.round((210 * 150) / 25.4);

					mapCanvas.width = width;
					mapCanvas.height = height;

					const mapContext = mapCanvas.getContext('2d');
					Array.prototype.forEach.call(
						this.map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
						function(canvas) {
							if (canvas.width > 0) {
								const opacity =
									canvas.parentNode.style.opacity || canvas.style.opacity;
								mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

								console.log(canvas.width)
								console.log(canvas.height)

								const backgroundColor = canvas.parentNode.style.backgroundColor;
								if (backgroundColor) {
									mapContext.fillStyle = backgroundColor;
									mapContext.fillRect(0, 0, canvas.width, canvas.height);
								}

								let matrix;
								const transform = canvas.style.transform;
								if (transform) {

									matrix = transform
										.match(/^matrix\(([^\(]*)\)$/)[1]
										.split(',')
										.map(Number);
								} else {
									matrix = [
										parseFloat(canvas.style.width) / canvas.width,
										0,
										0,
										parseFloat(canvas.style.height) / canvas.height,
										0,
										0,
									];
								}

								CanvasRenderingContext2D.prototype.setTransform.apply(
									mapContext,
									matrix
								);
								mapContext.drawImage(canvas, 0, 0);
							}
						}
					);
					mapContext.globalAlpha = 1;
// 导出地图pdf		   
					const pdf = new jsPDF('landscape', undefined, [width, height]);
					pdf.addImage(
						mapCanvas.toDataURL('image/jpeg'),
						'JPEG',
						0,
						0,
						width,
						height
					);
					pdf.save('map.pdf');

				});
				this.map.renderSync();
			},

			style() {
				const circleStyle = new Style({
					image: new Circle({
						radius: 5,
						fill: new Fill({
							color: 'LawnGreen',
						})
					})
				});
				return circleStyle;
			},

			readMVT() {
				const myLayer = new VectorTileLayer({
					style: this.style(),
					source: new VectorTile({
						visible: true,
						url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2020-03-18T00:00:00Z&layer=GRanD_Dams&tilematrixset=2km&Service=WMTS&Request=GetTile&Version=1.0.0&FORMAT=application%2Fvnd.mapbox-vector-tile&TileMatrix={z}&TileCol={x}&TileRow={y}',
						format: new MVT(),
						projection: 'EPSG:4326',
						tileGrid: new WMTSTileGrid({
							extent: [-180, -90, 180, 90],
							resolutions: [0.5625, 0.28125, 0.140625, 0.0703125, 0.03515625,
								0.017578125
							],
							tileSize: [512, 512]
						})
					})
				});
				this.map.addLayer(myLayer);
			},

			initMap() {

				this.map = new Map({
					layers: [
						new TileLayer({
							source: new OSM()
						}),
					],
					target: 'vue-openlayers',
					view: new View({
						center: [0, 0],
						projection: "EPSG:4326",
						zoom: 4,
					}),
				});


			},
		},
		mounted() {
			this.initMap();
			this.readMVT();
		},
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
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


