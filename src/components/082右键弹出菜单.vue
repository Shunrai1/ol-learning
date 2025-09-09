/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-29
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 使用右键弹出菜单，执行功能</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import {transform} from 'ol/proj';
	import LayerImage from 'ol/layer/Image';
	import LayerTile from 'ol/layer/Tile';
	import SourceOSM from 'ol/source/OSM';
	import LayerVector from 'ol/layer/Vector';
	import VectorSource from 'ol/source/Vector';
	import Feature from 'ol/Feature';
	import {Point,LineString,Circle,Polygon} from "ol/geom";
	import Style from 'ol/style/Style';
	import Fill from 'ol/style/Fill';
	import Stroke from 'ol/style/Stroke';
	import Icon from 'ol/style/Icon';
	import Text from 'ol/style/Text';
	import {format} from 'ol/coordinate';
	
	import 'ol-contextmenu/dist/ol-contextmenu.css';
	import ContextMenu from 'ol-contextmenu';

	export default {
		name: 'Mapbox',
		data() {
			return {
				map: null,
				vectorLayer: new LayerVector({
					source: new VectorSource()
				}),
			}
		},
		methods: {

			elastic(t) {
				return (
					Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
				);
			},

			center(obj) {
				this.map.getView().animate({
					duration: 700,
					easing: this.elastic,
					center: obj.coordinate,
				});
			},

			removeMarker(obj) {
				this.vectorLayer.getSource().removeFeature(obj.data.marker);
			},

			marker(obj) {
				var coord4326 = transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326'),
					template = '坐标 ({x} | {y})',
					iconStyle = new Style({
			  	image: new Icon({
							scale: 0.6,
							src: require('@/assets/img/location.png')
						}),
						text: new Text({
							offsetY: 25,
							text: format(coord4326, template, 2),
							font: '15px Open Sans,sans-serif',
							fill: new Fill({
								color: '#00f'
							}),
							stroke: new Stroke({
								color: '#eee',
								width: 2
							}),
						}),
					}),
					feature = new Feature({
						type: 'removable',
						geometry: new Point(obj.coordinate),
					});

				feature.setStyle(iconStyle);
				this.vectorLayer.getSource().addFeature(feature);
			},

			initMap() {
				var contextmenu_items = [{
						text: '设为中心点',
						classname: 'bold',
						icon: require('@/assets/img/center.png'),
						callback: this.center,
					},
					{
						text: '子功能菜单',
						icon: require('@/assets/img/list.png'),
						items: [{
								text: '设为中心点',
								icon: require('@/assets/img/center.png'),
								callback: this.center,
							},
							{
								text: '添加Maker',
								icon: require('@/assets/img/location.png'),
								callback: this.marker,
				   },
						],
					},

					'-', // this is a separator
				];

				var removeMarkerItem = {
					text: '删除Marker',
					classname: 'marker',
					callback: this.removeMarker,
				};


				this.map = new Map({
					layers: [
						new LayerTile({
							title: 'OSM',
							type: 'base',
							visible: true,
							source: new SourceOSM()
						}),
						this.vectorLayer
					],

					target: 'vue-openlayers',
					view: new View({
						center: [13247019.404399557, 4721671.572580107],
						projection: "EPSG:3857",
						zoom: 4,
					}),
				});

				var contextmenu = new ContextMenu({
					width: 180,
					items: contextmenu_items,
				});
				this.map.addControl(contextmenu);

				contextmenu.on('open', (evt) => {
					var feature = this.map.forEachFeatureAtPixel(evt.pixel, (ft, l) => {
						return ft;
					});
					if (feature && feature.get('type') === 'removable') {
						contextmenu.clear();
						removeMarkerItem.data = {
							marker: feature,
						};
						contextmenu.push(removeMarkerItem);
					} else {
						contextmenu.clear();
						contextmenu.extend(contextmenu_items);
						contextmenu.extend(contextmenu.getDefaultItems());
					}
				});

			},
		},
		mounted() {
			this.initMap();
		},

	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 520px;
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


